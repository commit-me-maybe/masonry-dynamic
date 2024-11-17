import styled from 'styled-components';
import useFetchPhotos from '../../hooks/useFetchPhotos';

interface MasonryGridProps {
  columnCount: number;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  height: 100vh;
`;

const Photo = styled.img<{ width: number; height: number }>`
  width: 100%;
  height: auto;
  aspect-ratio: ${(props) => props.width / props.height};
`;

const VirtualizedGrid = ({ columnCount }: MasonryGridProps) => {
  const { state } = useFetchPhotos(columnCount);

  return (
    <Grid id="masonry-grid">
      {state.columns.map((column: any, columnIndex: number) => (
        <div
          key={columnIndex}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          {column.map((photo: any) => (
            <Photo
              key={photo.id}
              loading="lazy"
              src={photo.src.medium}
              alt={photo.photographer}
              width={photo.width}
              height={photo.height}
            />
          ))}
        </div>
      ))}
    </Grid>
  );
};

export default VirtualizedGrid;
