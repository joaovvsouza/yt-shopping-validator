import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { getAllVideos, createValidationReport, getAllReports, getOrCreateAnonymousUser } from '../db';
import * as XLSX from 'xlsx';

export const reportsRouter = router({
  exportToCSV: publicProcedure
    .input(z.object({
      format: z.enum(['csv', 'excel']),
    }))
    .mutation(async ({ input }) => {
      try {
        const videos = await getAllVideos();
        const anonymousUserId = await getOrCreateAnonymousUser();

        if (videos.length === 0) {
          throw new Error('Nenhum vídeo para exportar');
        }

        // Prepare data for export
        const data = videos.map((video: any) => ({
          'ID': video.id,
          'URL': video.youtubeUrl,
          'Título': video.title || '',
          'Creator': video.creator || '',
          'Hashtag Obrigatória': video.requiredHashtag,
          'Tem Hashtag': video.hasRequiredHashtag ? 'Sim' : 'Não',
          'Produtos': video.productCount,
          'Status': video.status,
          'Data': new Date(video.createdAt).toLocaleDateString('pt-BR'),
        }));

        // Create workbook
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Validações');

        // Generate file
        const fileName = `validacoes_${new Date().getTime()}.${input.format === 'excel' ? 'xlsx' : 'csv'}`;
        
        // Convert to buffer
        const buffer = XLSX.write(wb, { bookType: input.format === 'excel' ? 'xlsx' : 'csv', type: 'buffer' });

        // Create report record
        await createValidationReport({
          userId: anonymousUserId,
          totalVideos: videos.length,
          totalProducts: videos.reduce((sum: number, v: any) => sum + v.productCount, 0),
          videosWithHashtag: videos.filter((v: any) => v.hasRequiredHashtag).length,
          videosWithoutHashtag: videos.filter((v: any) => !v.hasRequiredHashtag).length,
          successCount: videos.filter((v: any) => v.status === 'completed').length,
          failureCount: videos.filter((v: any) => v.status === 'failed').length,
          exportFormat: input.format,
          exportedAt: new Date(),
        });

        return {
          fileName,
          buffer: buffer.toString('base64'),
          mimeType: input.format === 'excel' 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv',
        };
      } catch (error) {
        throw error;
      }
    }),

  getReports: publicProcedure
    .query(async () => {
      return await getAllReports();
    }),

  getDashboardStats: publicProcedure
    .query(async () => {
      const videos = await getAllVideos();
      const reports = await getAllReports();

      return {
        totalVideos: videos.length,
        totalProducts: videos.reduce((sum: number, v: any) => sum + v.productCount, 0),
        videosWithHashtag: videos.filter((v: any) => v.hasRequiredHashtag).length,
        videosWithoutHashtag: videos.filter((v: any) => !v.hasRequiredHashtag).length,
        successCount: videos.filter((v: any) => v.status === 'completed').length,
        failureCount: videos.filter((v: any) => v.status === 'failed').length,
        totalReports: reports.length,
        lastExport: reports[0]?.exportedAt,
      };
    }),
});
