import React from 'react';
import useFetchPhotos from '../../hooks/useFetchPhotos';

const MasonryGrid: React.FC = () => {
  const { photos } = useFetchPhotos();

  return (
    // TODO: Implement masonry grid
    <div className="masonry-grid">
      {photos.map((photo) => (
        <img key={photo.id} src={photo.src.medium} alt={photo.photographer} />
      ))}
    </div>
  );
};

export default MasonryGrid;
