import { Photo } from '../types';
import debounce from 'lodash/debounce';

const API_KEY = process.env.REACT_APP_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1/';

const fetchPhotosBase = async (
  page: number,
  perPage: number
): Promise<Photo[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}curated?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
};

const debouncedFetchPhotos = debounce(fetchPhotosBase, 300, { leading: true });

export const fetchPhotos = debouncedFetchPhotos;
