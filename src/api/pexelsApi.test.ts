import { fetchPhotos, fetchPhotoById, searchPhotos } from './pexelsApi';

global.fetch = jest.fn();

console.error = jest.fn();

describe('Pexels API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPhotos', () => {
    it('should fetch photos successfully', async () => {
      const mockPhotos = [{ id: 1, url: 'test.jpg' }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ photos: mockPhotos }),
      });

      const result = await fetchPhotos(1, 10);
      expect(result).toEqual(mockPhotos);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.pexels.com/v1/curated?page=1&per_page=10',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });
  });

  describe('fetchPhotoById', () => {
    it('should fetch a single photo successfully', async () => {
      const mockPhoto = { id: '123', url: 'test.jpg' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhoto,
      });

      const result = await fetchPhotoById('123');
      expect(result).toEqual(mockPhoto);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.pexels.com/v1/photos/123',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });

    it('should return null on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await fetchPhotoById('123');
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('searchPhotos', () => {
    it('should search photos successfully', async () => {
      const mockPhotos = [{ id: 1, url: 'test.jpg' }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ photos: mockPhotos }),
      });

      const result = await searchPhotos('nature');
      expect(result).toEqual(mockPhotos);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.pexels.com/v1/search?query=nature&per_page=40',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });

    it('should return null on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await searchPhotos('nature');
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle non-OK responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await searchPhotos('nature');
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
