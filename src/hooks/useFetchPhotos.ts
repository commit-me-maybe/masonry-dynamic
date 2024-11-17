import { useState, useEffect } from 'react';
import { fetchPhotos } from '../api/pexelsApi';

interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
}

const useFetchPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      try {
        const newPhotos = await fetchPhotos(page, 30);
        if (newPhotos) {
          setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
          setError(null);
        }
      } catch (err) {
        setError('Failed to fetch photos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return { photos, loading, error, loadMore };
};

export default useFetchPhotos;
