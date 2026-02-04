import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { extractYouTubeData } from '../youtube-extractor';

export const videosRouter = router({
  processVideo: publicProcedure
    .input(z.object({
      url: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Extract YouTube data (no database saving)
        const youtubeData = await extractYouTubeData(input.url);

        // Return data directly without saving to database
        return {
          success: true,
          data: {
            ...youtubeData,
            youtubeUrl: input.url,
            processedAt: new Date().toISOString(),
          },
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Erro ao processar vídeo: ${errorMessage}`);
      }
    }),

  listVideos: publicProcedure
    .query(async () => {
      return await getAllVideos();
    }),

  getVideoDetails: publicProcedure
    .input(z.object({ videoId: z.number() }))
    .query(async ({ input }) => {
      const video = await getVideoById(input.videoId);
      
      if (!video) {
        throw new Error('Video not found');
      }

      const products = await getProductsByVideoId(input.videoId);

      return {
        video,
        products,
      };
    }),

  deleteVideo: publicProcedure
    .input(z.object({ videoId: z.number() }))
    .mutation(async ({ input }) => {
      const video = await getVideoById(input.videoId);
      
      if (!video) {
        throw new Error('Video not found');
      }

      // Delete will cascade to products
      const { getDb } = await import('../db');
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      await db.delete(videos).where(eq(videos.id, input.videoId));

      return { success: true };
    }),
});