## Run the project

Generate API key from Pexels and add it to .env file.

```
REACT_APP_PEXELS_API_KEY=YOUR_API_KEY
```

Run the project:

```
npm install

npm start
```

## Deployment

Project is deployed on Vercel: https://dynamic-masonry.vercel.app.

## Notes

- Project is using React 18.
- Project is using React Router v6.
- Project is using Styled Components.
- Project is using Immer for state management.
- Project is using Pexels API for photos.
- Project is using Vercel for deployment.

## TODO

- Add more tests.
- Handle search query better.
- Improve mobile layout.
- Refactor MasonryGrid component
- Better handle loading and error states.
- Accessibility Improvements
- Currently API returns same photos multiple times, which could affect the logic. We should handle it better.
- Improve CLS. Sometimes it's still getiing a bit high, because of img positioning. Could be improved.
- Overall performace looks good, but we could improve a few things with more time:

  - LCP: Could be improved by preloading visible images on initial render
  - FCP/TTI/TBT We currently load 50 photos at a time, but it could be improved by loading less photos and then loading more when scrolling.
  - Currently we are triggering a lot of renders with masonry layout. Which should be improved. One of the causing factors is the scroll handling, at least throttling should be added.

- If we had access to the API, we could potentially use it to generate background information, such as a blurhash for efficient image representation before the image is loaded.
- We could also potentially load more photos on background if we know that user is going to scroll (check for metrics if we had them).
- If we had access to the API, use formats like webp for better performance.
