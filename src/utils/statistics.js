import dayjs from 'dayjs';

export const makeUniquePoints = (points) => [...new Set(points)];

export const countMoneyByType = (points, type) => {
  const typesOfPoints = points.filter((point) => point.pointType === type);

  return typesOfPoints.reduce((sum, point) => sum + point.price, 0);
};

export const countTypesByType = (points, type) => {
  const typesOfPoints = points.filter((point) => point.pointType === type);

  return typesOfPoints.length;
};

export const countDurationByType = (points, type) => {
  const typeEvents = points.filter((point) => point.pointType === type);

  return typeEvents.reduce((sum, point) => {
    const diff = dayjs(point.date.endTimeEvt).diff(dayjs(point.date.startTimeEvt));
    const days = dayjs.duration(diff).days();
    return sum + days;
  }, 0);
};
