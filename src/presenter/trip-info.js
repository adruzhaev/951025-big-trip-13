import TripInfoView from '../view/trip-info';
import {render, RenderPosition, remove} from '../utils/render';
import {sortPointByTime} from '../utils/point';

export default class TripInfo {
  constructor(tripInfoContainer, pointsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;

    this._handleModelPoint = this._handleModelPoint.bind(this);
    this._pointsModel.addObserver(this._handleModelPoint);
  }

  init() {
    const prevTripInfoComponent = this._tripInfoComponent;

    if (prevTripInfoComponent !== null) {
      remove(prevTripInfoComponent);
    }

    this._renderTripInfo();
  }

  _handleModelPoint() {
    this.init();
  }

  _renderTripInfo() {
    if (this._pointsModel.getPoints().length === 0) {
      return;
    }

    const points = this._pointsModel.getPoints().slice().sort(sortPointByTime);

    this._tripInfoComponent = new TripInfoView(points);

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
}
