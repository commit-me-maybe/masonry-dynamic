import React from 'react';

interface MasonryGridProps {
  children?: React.ReactNode;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ children }) => {
  return (
    // TODO: Implement masonry grid
    <div className="masonry-grid">{children}</div>
  );
};

export default MasonryGrid;
