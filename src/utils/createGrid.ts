export const createGrid = (height: number, width: number): number[] => {
  const grid: number[] = Array(height * width).fill(0);
  return grid;
};
