import styled from 'styled-components';
import useFetchPhotos from '../../hooks/useFetchPhotos';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useEffect } from 'react';

interface MasonryGridProps {
  columnCount: number;
}

const Grid = styled.div<{ $columnCount: number }>`
  position: relative;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
`;

const Column = styled.div<{
  $index: number;
  $columnCount: number;
  $height: number;
}>`
  position: absolute;
  width: ${(props) => `calc(100% / ${props.$columnCount} - 24px)`};
  left: ${(props) => `${(props.$index * 100) / props.$columnCount}%`};
  padding: 0 24px;
  box-sizing: border-box;
  height: ${(props) => `${props.$height}px`};
`;

const PhotoWrapper = styled.div.attrs<{ $top: number }>((props) => ({
  style: {
    top: `${props.$top}px`,
  },
}))`
  position: absolute;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  background-color: #f0f0f0;
`;

const Photo = styled.img<{ width: number; height: number }>`
  width: 100%;
  height: auto;
  border-radius: 12px;
  transition: transform 0.2s ease;
  display: block;

  &:hover {
    transform: scale(1.02);
  }
`;

const VirtualizedGrid = ({ columnCount }: MasonryGridProps) => {
  const { state, handleSearch } = useFetchPhotos(columnCount);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  useEffect(() => {
    const checkVisibility = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const buffer = viewportHeight * 2;

      setVisibleRange({
        start: Math.max(0, scrollTop - buffer),
        end: scrollTop + viewportHeight + buffer,
      });
    };

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
    return () => window.removeEventListener('scroll', checkVisibility);
  }, []);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <Grid $columnCount={columnCount}>
        {state.columns.map((column: any, columnIndex: number) => {
          const columnHeight =
            state.photoPositions[columnIndex]?.[column.length - 1] || 0;

          return (
            <Column
              key={columnIndex}
              $index={columnIndex}
              $columnCount={columnCount}
              $height={columnHeight + 100}
            >
              {column.map((photo: any, photoIndex: number) => {
                const top = state.photoPositions[columnIndex][photoIndex] || 0;
                const isVisible =
                  top >= visibleRange.start && top <= visibleRange.end;

                return (
                  <PhotoWrapper key={photo.id} $top={top}>
                    {isVisible && (
                      <Link to={`/photo-details/${photo.id}`} state={{ photo }}>
                        <Photo
                          loading="lazy"
                          src={photo.src.medium}
                          alt={photo.photographer}
                          width={photo.width}
                          height={photo.height}
                        />
                      </Link>
                    )}
                  </PhotoWrapper>
                );
              })}
            </Column>
          );
        })}
      </Grid>
    </>
  );
};

export default VirtualizedGrid;
