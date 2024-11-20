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

const GAP = 16;
const COLUMN_PADDING = 12;
const PHOTOS_PER_PAGE = 50;

const calculateLayoutDimensions = (columnCount: number) => {
  const totalWidth = window.innerWidth - COLUMN_PADDING * 2;
  const columnWidth = totalWidth / columnCount - COLUMN_PADDING * 2;
  return { totalWidth, columnWidth };
};

const calculatePhotoPosition = (
  columnHeight: number,
  isFirstInColumn: boolean,
  photoHeight: number
) => {
  const currentPosition = columnHeight + (isFirstInColumn ? 0 : GAP);
  return { currentPosition, newHeight: currentPosition + photoHeight };
};

const distributePhotos = (
  photos: Photo[],
  columnCount: number,
  initialState: MasonryState
) => {
  const newColumns = [...initialState.columns.map((column) => [...column])];
  const newColumnHeights = [...initialState.columnHeights];
  const newPhotoPositions = [
    ...initialState.photoPositions.map((pos) => [...pos]),
  ];
  const { columnWidth } = calculateLayoutDimensions(columnCount);

  photos?.forEach((photo: Photo) => {
    const shortestColumnIndex = newColumnHeights.indexOf(
      Math.min(...newColumnHeights)
    );
    const photoHeight = Math.round((photo.height / photo.width) * columnWidth);

    newColumns[shortestColumnIndex].push(photo);

    const isFirstInColumn = newColumns[shortestColumnIndex].length === 1;
    const { currentPosition, newHeight } = calculatePhotoPosition(
      newColumnHeights[shortestColumnIndex],
      isFirstInColumn,
      photoHeight
    );

    newPhotoPositions[shortestColumnIndex].push(currentPosition);
    newColumnHeights[shortestColumnIndex] = newHeight;
  });

  return { newColumns, newColumnHeights, newPhotoPositions };
};

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
    // TODO: Handle search query better
    // Currently API doesn't support search query in pagination.
    if (loading.current || searchQuery) return;
    loading.current = true;

    try {
      const newPhotos = await fetchPhotos(page.current, PHOTOS_PER_PAGE);
      if (!newPhotos) return;

      const { newColumns, newColumnHeights, newPhotoPositions } =
        distributePhotos(newPhotos, columnCount, state);

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

      const initialState: MasonryState = {
        columns: Array.from({ length: columnCount }, () => []),
        columnHeights: new Array(columnCount).fill(0),
        photoPositions: Array.from({ length: columnCount }, () => []),
        isLoading: false,
      };

      setState(initialState);

      const photos = await searchPhotos(query, PHOTOS_PER_PAGE);
      if (!photos) return;

      const { newColumns, newColumnHeights, newPhotoPositions } =
        distributePhotos(photos, columnCount, initialState);

      setState(
        produce(state, (draft) => {
          draft.columns = newColumns;
          draft.columnHeights = newColumnHeights;
          draft.photoPositions = newPhotoPositions;
        })
      );
    },
    [columnCount, state]
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
