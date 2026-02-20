import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { extractYouTubeData } from '../youtube-extractor';

// Custom schema for YouTube URLs that accepts various formats
const youtubeUrlSchema = z.string().refine(
  (url) => {
    // Check if it's a valid YouTube URL format
    const youtubePatterns = [
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//,
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
    ];
    
    // First check if it matches YouTube patterns
    const isYouTubeUrl = youtubePatterns.some(pattern => pattern.test(url));
    
    if (!isYouTubeUrl) {
      return false;
    }
    
    // Then validate it's a proper URL format
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: 'URL inválida. Forneça uma URL válida do YouTube (youtube.com/watch?v=... ou youtu.be/...)',
  }
);

export const videosRouter = router({
  processVideo: publicProcedure
    .input(z.object({
      url: youtubeUrlSchema,
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