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
  padding: 0 12px;

  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;

const Column = styled.div<{
  $index: number;
  $columnCount: number;
  $height: number;
}>`
  position: absolute;
  width: ${(props) => `calc(100% / ${props.$columnCount} - 24px)`};
  left: ${(props) => `${(props.$index * 100) / props.$columnCount}%`};
  padding: 0 16px;
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
  border-radius: 8px;

  @media (max-width: 768px) {
    border-radius: 6px;
  }
`;

const Photo = styled.img<{ width: number; height: number }>`
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.2s ease;
  display: block;

  &:hover {
    transform: scale(1.02);
  }
`;

const VirtualizedGrid = ({ columnCount }: MasonryGridProps) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const { state, handleSearch } = useFetchPhotos(columnCount);

  useEffect(() => {
    const checkVisibility = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const buffer = viewportHeight * 4;

      setVisibleRange({
        start: Math.max(0, scrollTop - buffer),
        end: scrollTop + viewportHeight + buffer,
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    checkVisibility();
    return () => window.removeEventListener('scroll', onScroll);
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
                  isVisible && (
                    // TODO: make key's unique
                    <PhotoWrapper $top={top} key={photo.id}>
                      <Link to={`/photo-details/${photo.id}`} state={{ photo }}>
                        <Photo
                          loading="lazy"
                          src={photo.src.medium}
                          alt={photo.photographer}
                          width={photo.width}
                          height={photo.height}
                        />
                      </Link>
                    </PhotoWrapper>
                  )
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
