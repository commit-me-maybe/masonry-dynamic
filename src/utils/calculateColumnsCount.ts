export const calculateColumnCount = (width: number) => {
  const extraMargin = 60;
  const columnWidth = 200;

  return Math.floor((width - extraMargin) / columnWidth);
};
