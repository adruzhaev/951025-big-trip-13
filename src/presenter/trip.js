import SortView from '../view/sorting';
import TripEventsListView from '../view/trip-events-list';
import NoPointView from '../view/no-route-point';
import PointPresenter from './point';
import {updateItem} from '../utils/common';
import {render, RenderPosition} from '../utils/render';
import {SortType} from '../const';
import {sortPointByTime, sortPointByPrice} from '../utils/point'; // sortPointByDay

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = {};

    this._sor = SortType.DAY;
    this._sortComponent = new SortView(this._sor);
    this._tripComponent = new TripEventsListView();
    this._noPointComponent = new NoPointView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._sourcedPoints = points.slice();

    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);

    this._renderTrip();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _sortPoints(sortType) {

    switch (sortType) {
      case SortType.PRICE:
        this._points.sort(sortPointByPrice);
        break;
      case SortType.TIME:
        this._points.sort(sortPointByTime);
        break;
      default:
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    [...this._sortComponent.getElement().querySelectorAll(`.trip-sort__input`)].map((element) => {
      element.removeAttribute(`checked`);
    });

    this._sortComponent.getElement().querySelector(`#sort-${sortType.toLowerCase()}`).setAttribute(`checked`, `checked`);

    this._sortPoints(sortType);
    this._clearPoints();
    this._renderPoints();
  }

  _renderSort() {
    render(this._tripComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderNoPoints() {
    render(this._tripComponent, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _clearPoints() {
    Object.values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _renderTrip() {
    if (this._points.length === 0) {
      this._renderNoPoints();
    } else {
      this._renderSort();
      render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    }

    this._renderPoints();
  }
}
