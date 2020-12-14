export const sortPointByDay = (pointA, pointB) => {
  return pointB.startTimeEvt - pointA.startTimeEvt;
};

export const sortPointByTime = () => {

};

export const sortPointByPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};
