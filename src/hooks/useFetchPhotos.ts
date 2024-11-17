import { useState, useEffect, useRef, useCallback } from 'react';
import { produce } from 'immer';
import { fetchPhotos } from '../api/pexelsApi';
import { Photo } from '../types';

interface MasonryState {
  columns: Photo[][];
  columnHeights: number[];
  isLoading: boolean;
}

const useFetchPhotos = (columnCount: number) => {
  const [state, setState] = useState<MasonryState>(() => ({
    columns: Array.from({ length: columnCount }, () => []),
    columnHeights: new Array(columnCount).fill(0),
    isLoading: false,
  }));

  const page = useRef(1);
  const loading = useRef(false);

  const loadMorePhotos = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;

    try {
      const newPhotos = await fetchPhotos(page.current, 50);

      const newColumns = [...state.columns.map((column) => [...column])];
      const newColumnHeights = [...state.columnHeights];

      newPhotos?.forEach((photo: Photo) => {
        const shortestColumnIndex = newColumnHeights.indexOf(
          Math.min(...newColumnHeights)
        );

        newColumns[shortestColumnIndex].push(photo);
        newColumnHeights[shortestColumnIndex] += photo.height;
      });

      const newState = produce(state, (draft) => {
        draft.columns = newColumns;
        draft.columnHeights = newColumnHeights;
      });

      setState(newState);
      page.current += 1;
    } finally {
      loading.current = false;
    }
  }, [state]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading.current) {
        loadMorePhotos();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePhotos]);

  // Load initial photos
  useEffect(() => {
    loadMorePhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { state, loadMorePhotos };
};

export default useFetchPhotos;
