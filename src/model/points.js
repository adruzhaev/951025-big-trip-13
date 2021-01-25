import Observer from '../utils/observer';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  getPoints() {
    return this._points;
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting points`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting points`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          date: {
            startTime: point.date_from,
            endTime: point.date_to,
          },
          price: point.base_price,
          isFavorite: point.is_favorite,
          destinationName: point.destination.name,
          destinationDescription: point.destination.description,
          destinationPhotos: point.destination.pictures,
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.destination;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "date_from": point.date.startTime,
          "date_to": point.date.endTime,
          "destination": {
            "name": point.destinationName,
            "description": point.destinationDescription,
            "pictures": point.destinationPhotos
          },
          "is_favorite": point.isFavorite,
          "base_price": point.price
        }
    );

    delete adaptedPoint.date;
    delete adaptedPoint.destinationPhotos;
    delete adaptedPoint.destinationName;
    delete adaptedPoint.destinationDescription;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.price;

    return adaptedPoint;
  }
}
