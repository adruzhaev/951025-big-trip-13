import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const makeUniquePoints = (points) => [...new Set(points)];

export const countMoneyByType = (points, type) => {
  const typesOfPoints = points.filter((point) => point.type === type);

  return typesOfPoints.reduce((sum, point) => sum + point.price, 0);
};

export const countTypesByType = (points, type) => {
  const typesOfPoints = points.filter((point) => point.type === type);

  return typesOfPoints.length;
};

export const countDurationByType = (points, type) => {
  const typePoints = points.filter((point) => point.type === type);

  return typePoints.reduce((sum, point) => {
    const pointDuration = dayjs(point.date.endTime).diff(dayjs(point.date.startTime));

    const days = dayjs.duration(pointDuration).days();
    return sum + days;
  }, 0);
};
