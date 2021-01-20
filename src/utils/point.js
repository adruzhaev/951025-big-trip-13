import dayjs from "dayjs";

export const sortPointByDay = (pointA, pointB) => {
  return pointA.date.startTime - pointB.date.startTime;
};

export const sortPointByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.date.startTime).diff(dayjs(pointA.date.endTime));
  const durationB = dayjs(pointB.date.startTime).diff(dayjs(pointB.date.endTime));

  return durationA - durationB;
};

export const sortPointByPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};

export const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, `D`);
};

export const isPointPast = (date) => {
  return dayjs(date).diff(dayjs()) < 0;
};

export const isPointFuture = (date) => {
  return dayjs(date).diff(dayjs()) >= 0;
};
