export const calculateColumnCount = (width: number) => {
  const extraMargin = 32;
  const columnWidth = 200;
  const count = Math.floor((width - extraMargin) / columnWidth);
  return Math.max(1, count);
};
