import {createElement} from "../utils";

const destinationPointsSearch = (points) => {
  let destinationPoints = [];

  for (let point of points) {
    destinationPoints.push(point.destinationName);
  }

  return destinationPoints;
};

const totalPriceCount = (points) => {
  let totalPrice = 0;

  for (let point of points) {
    totalPrice += point.price;
  }

  return totalPrice;
};

const createRouteInfoTemplate = (points) => {
  const pointsOfDestination = (destinationPointsSearch(points).length > 3) ?
    `${destinationPointsSearch(points)[0]} &mdash; &mldr; &mdash; ${destinationPointsSearch(points)[destinationPointsSearch(points).length - 1]}`
    : destinationPointsSearch(points).join(` &mdash; `);
  const totalPrice = totalPriceCount(points);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${pointsOfDestination}</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;
};

export default class RouteInfo {
  constructor(points) {
    this._points = points;

    this._element = null;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
