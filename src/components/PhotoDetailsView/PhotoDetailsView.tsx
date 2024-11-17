import { Link, useParams } from 'react-router-dom';

const PhotoDetailsView = () => {
  const { id } = useParams();

  return (
    <div>
      <Link to="/">Back to Grid</Link>
      <h1>Photo Details for ID: {id}</h1>
      {/* TODO: Implement photo details view */}
    </div>
  );
};

export default PhotoDetailsView;
