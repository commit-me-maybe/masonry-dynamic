import { useState, useEffect, useRef, useCallback } from 'react';
import { produce } from 'immer';
import { fetchPhotos, searchPhotos } from '../api/pexelsApi';
import { Photo } from '../types';

interface MasonryState {
  columns: Photo[][];
  columnHeights: number[];
  photoPositions: number[][];
  isLoading: boolean;
}

const useFetchPhotos = (columnCount: number) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [state, setState] = useState<MasonryState>(() => ({
    columns: Array.from({ length: columnCount }, () => []),
    columnHeights: new Array(columnCount).fill(0),
    photoPositions: Array.from({ length: columnCount }, () => []),
    isLoading: false,
  }));

  const page = useRef(1);
  const loading = useRef(false);

  const loadMorePhotos = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;

    try {
      const newPhotos = searchQuery
        ? await searchPhotos(searchQuery)
        : await fetchPhotos(page.current, 50);

      const newColumns = [...state.columns.map((column) => [...column])];
      const newColumnHeights = [...state.columnHeights];
      const newPhotoPositions = [
        ...state.photoPositions.map((positions) => [...positions]),
      ];

      const GAP = 16;
      const COLUMN_PADDING = 12;
      // Calculate actual available width for images
      const totalWidth = window.innerWidth - COLUMN_PADDING * 2; // Account for grid padding
      const columnWidth = totalWidth / columnCount - COLUMN_PADDING * 2; // Account for column padding

      newPhotos?.forEach((photo: Photo) => {
        const shortestColumnIndex = newColumnHeights.indexOf(
          Math.min(...newColumnHeights)
        );

        // Calculate photo height based on the actual available width
        const photoHeight = Math.round(
          (photo.height / photo.width) * columnWidth
        );

        newColumns[shortestColumnIndex].push(photo);

        // For first photo in column, don't add gap
        const isFirstInColumn = newColumns[shortestColumnIndex].length === 1;
        const currentPosition =
          newColumnHeights[shortestColumnIndex] + (isFirstInColumn ? 0 : GAP);

        newPhotoPositions[shortestColumnIndex].push(currentPosition);
        newColumnHeights[shortestColumnIndex] = currentPosition + photoHeight;
      });

      setState(
        produce(state, (draft) => {
          draft.columns = newColumns;
          draft.columnHeights = newColumnHeights;
          draft.photoPositions = newPhotoPositions;
        })
      );

      page.current += 1;
    } finally {
      loading.current = false;
    }
  }, [state, searchQuery, columnCount]);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      page.current = 1;
      setState({
        columns: Array.from({ length: columnCount }, () => []),
        columnHeights: new Array(columnCount).fill(0),
        photoPositions: Array.from({ length: columnCount }, () => []),
        isLoading: false,
      });

      if (query) {
        const searchResults = await searchPhotos(query);
        if (searchResults) {
          const newColumns = Array.from({ length: columnCount }, () => []);
          const newColumnHeights = new Array(columnCount).fill(0);
          const newPhotoPositions = Array.from(
            { length: columnCount },
            () => []
          );

          searchResults.forEach((photo: Photo) => {
            const shortestColumnIndex = newColumnHeights.indexOf(
              Math.min(...newColumnHeights)
            );

            const photoHeight =
              (photo.height / photo.width) * (window.innerWidth / columnCount);
            const gap = 16;

            (newColumns[shortestColumnIndex] as Photo[]).push(photo);
            (newPhotoPositions[shortestColumnIndex] as number[]).push(
              newColumnHeights[shortestColumnIndex]
            );
            newColumnHeights[shortestColumnIndex] += photoHeight + gap;
          });

          setState({
            columns: newColumns,
            columnHeights: newColumnHeights,
            photoPositions: newPhotoPositions,
            isLoading: false,
          });
        }
      } else {
        loadMorePhotos();
      }
    },
    [columnCount, loadMorePhotos]
  );

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

  return { state, loadMorePhotos, handleSearch };
};

export default useFetchPhotos;
