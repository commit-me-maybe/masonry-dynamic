import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchPhotoById } from '../../api/pexelsApi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Card = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ContentSection = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #4a5568;
  margin-bottom: 1rem;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

const MetadataItem = styled.div`
  span {
    font-weight: 600;
  }
`;

const FooterSection = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #71717a;
  color: white;
  border-radius: 0.25rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background: #52525b;
  }
`;

const PhotoDetailsView = () => {
  const { id } = useParams();
  const location = useLocation();
  const locationPhoto = location.state?.photo;
  const [photo, setPhoto] = useState(locationPhoto);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Handle errors
    if (!photo && id) {
      setLoading(true);
      fetchPhotoById(id)
        .then(setPhoto)
        .finally(() => setLoading(false));
    }
  }, [id, photo]);

  if (!photo || loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Card>
        <ImageContainer>
          <Image src={photo.src.large} alt={photo.title} />
        </ImageContainer>

        <ContentSection>
          <Title>{photo.title}</Title>
          <Description>{photo.description}</Description>

          <MetadataGrid>
            <MetadataItem>
              <span>Photographer: </span>
              {photo.photographer}
            </MetadataItem>
            <MetadataItem>
              <span>Description </span>
              {photo.alt}
            </MetadataItem>
            <MetadataItem>
              <span>Author url: </span>
              <a
                href={photo.photographer_url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {photo.photographer_url}
              </a>
            </MetadataItem>
          </MetadataGrid>
        </ContentSection>

        <FooterSection>
          <BackButton to="/">Back to Gallery</BackButton>
        </FooterSection>
      </Card>
    </Container>
  );
};

export default PhotoDetailsView;
