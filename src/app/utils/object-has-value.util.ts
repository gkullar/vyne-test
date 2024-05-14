export const objectHasValue = (obj: object): boolean => {
  return Object.values(obj).some((value) => !!value);
};
