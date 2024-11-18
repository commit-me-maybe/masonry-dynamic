import styled from 'styled-components';
import useFetchPhotos from '../../hooks/useFetchPhotos';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

interface MasonryGridProps {
  columnCount: number;
}

const Grid = styled.div<{ $columnCount: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columnCount}, 1fr);
  gap: 16px;
  min-height: 100vh;
`;

const Photo = styled.img<{ width: number; height: number }>`
  width: 100%;
  height: auto;
  aspect-ratio: ${(props) => props.width / props.height};
`;

const VirtualizedGrid = ({ columnCount }: MasonryGridProps) => {
  const { state, handleSearch } = useFetchPhotos(columnCount);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <Grid $columnCount={columnCount}>
        {state.columns.map((column: any, columnIndex: number) => (
          <div
            key={columnIndex}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {column.map((photo: any) => (
              <Link
                to={`/photo-details/${photo.id}`}
                key={photo.id}
                state={{ photo }}
              >
                <Photo
                  key={photo.id}
                  loading="lazy"
                  src={photo.src.medium}
                  alt={photo.photographer}
                  width={photo.width}
                  height={photo.height}
                />
              </Link>
            ))}
          </div>
        ))}
      </Grid>
    </>
  );
};

export default VirtualizedGrid;
