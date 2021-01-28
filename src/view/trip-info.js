import AbstractView from "./abstract";
import dayjs from "dayjs";

const destinationPointsSearch = (points) => {
  const destinationPoints = [];

  for (const point of points) {
    destinationPoints.push(point.destinationName);
  }

  return destinationPoints;
};

const totalPriceCount = (points) => {
  let totalPrice = 0;

  for (const point of points) {
    totalPrice += point.price;
  }

  return totalPrice;
};

const createRouteInfoTemplate = (points) => {
  const pointsOfDestination = (destinationPointsSearch(points).length > 3) ?
    `${destinationPointsSearch(points)[0]} &mdash; &mldr; &mdash; ${destinationPointsSearch(points)[destinationPointsSearch(points).length - 1]}`
    : destinationPointsSearch(points).join(` &mdash; `);
  const totalPrice = totalPriceCount(points);

  const startTime = dayjs(points[0].date.startTime).format(`MMM DD`);
  const endTime = dayjs(points[points.length - 1].date.startTime).format(`MMM DD`);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${pointsOfDestination}</h1>

      <p class="trip-info__dates">${startTime}&nbsp;&mdash;&nbsp;${endTime}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._points);
  }
}
