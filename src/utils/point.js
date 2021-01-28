import dayjs from "dayjs";

export const getEventDuration = (dateStart, dateEnd) => {
  const diff = dayjs(dateEnd).diff(dayjs(dateStart));
  const days = dayjs.duration(diff).days().toString();
  const hours = dayjs.duration(diff).hours().toString();
  const minutes = dayjs.duration(diff).minutes().toString();

  return `${days > 0 ? days + `D` : ``} ${hours > 0 ? hours.padStart(2, `0`) + `H` : ``} ${minutes.padStart(2, `0`)}M`;
};

export const sortPointByDay = (pointA, pointB) => {
  return new Date(pointA.date.startTime) - new Date(pointB.date.startTime);
};

export const sortPointByTime = (pointA, pointB) => {
  return dayjs(pointA.date.startTime).diff(dayjs(pointB.date.endTime));
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

export const isOnline = () => {
  return window.navigator.onLine;
};
