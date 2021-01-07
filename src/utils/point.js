import dayjs from "dayjs";

export const sortPointByDay = (pointA, pointB) => {
  return pointA.date.startTimeEvt - pointB.date.startTimeEvt;
};

export const sortPointByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.date.startTimeEvt).diff(dayjs(pointA.date.endTimeEvt));
  const durationB = dayjs(pointB.date.startTimeEvt).diff(dayjs(pointB.date.endTimeEvt));

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
}
