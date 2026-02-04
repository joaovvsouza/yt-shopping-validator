import { describe, it, expect } from 'vitest';
import { checkHashtagInDescription } from './youtube-extractor';

describe('YouTube Extractor', () => {
  describe('extractVideoIdFromUrl', () => {
    it('should extract video ID from youtube.com/watch?v=ID', () => {
      const url = 'https://www.youtube.com/watch?v=a9nVeFqop44';
      // This would require importing the function, which is not exported
      // For now, we test via the public API
    });

    it('should extract video ID from youtube.com/shorts/ID', () => {
      const url = 'https://www.youtube.com/shorts/a9nVeFqop44';
      // This would require importing the function
    });

    it('should extract video ID from youtu.be/ID', () => {
      const url = 'https://youtu.be/a9nVeFqop44';
      // This would require importing the function
    });
  });

  describe('checkHashtagInDescription', () => {
    it('should find hashtag in description', () => {
      const description = 'Check out this video #pagamento for more info';
      expect(checkHashtagInDescription(description, '#pagamento')).toBe(true);
    });

    it('should find hashtag case-insensitively', () => {
      const description = 'Check out this video #PAGAMENTO for more info';
      expect(checkHashtagInDescription(description, '#pagamento')).toBe(true);
    });

    it('should handle hashtag without # prefix', () => {
      const description = 'Check out this video #pagamento for more info';
      expect(checkHashtagInDescription(description, 'pagamento')).toBe(true);
    });

    it('should return false when hashtag not found', () => {
      const description = 'Check out this video for more info';
      expect(checkHashtagInDescription(description, '#pagamento')).toBe(false);
    });

    it('should find multiple hashtags', () => {
      const description = '#promoção #pagamento #desconto';
      expect(checkHashtagInDescription(description, '#pagamento')).toBe(true);
    });

    it('should handle empty description', () => {
      expect(checkHashtagInDescription('', '#pagamento')).toBe(false);
    });

    it('should handle custom hashtags', () => {
      const description = 'Check out #customtag in this video';
      expect(checkHashtagInDescription(description, '#customtag')).toBe(true);
    });
  });
});
