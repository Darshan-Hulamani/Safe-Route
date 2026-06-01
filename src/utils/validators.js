export const isValidCoordinate = (coord) => {
  return coord && typeof coord.lat === 'number' && typeof coord.lng === 'number';
};