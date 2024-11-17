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
            <img
              key={photo.id}
              style={{ width: '100%' }}
              loading="lazy"
              src={photo.src.medium}
              alt={photo.photographer}
            />
          ))}
        </div>
      ))}
    </Grid>
  );
};

export default VirtualizedGrid;
