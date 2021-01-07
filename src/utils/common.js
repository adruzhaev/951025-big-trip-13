export const getRandomInt = (min = 0, max = 1) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
