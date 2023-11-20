export const checkAllForm = <T extends object>(obj: T): boolean => {
  const objValues = Object.values(obj);
  return objValues.every((value) => value !== '');
};
