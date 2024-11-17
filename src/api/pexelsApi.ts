const API_KEY = process.env.REACT_APP_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1/';

const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let inThrottle: boolean = false;
  let lastResult: ReturnType<T>;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (!inThrottle) {
      inThrottle = true;
      lastResult = await func(...args);
      setTimeout(() => (inThrottle = false), limit);
    }
    return lastResult;
  };
};

// Throttle to prevent too many requests
const throttledFetchPhotos = throttle(async (page: number, perPage: number) => {
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
  }
}, 1000);

export const fetchPhotos = throttledFetchPhotos;
