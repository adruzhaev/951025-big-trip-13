import SortView from '../view/sorting';
import TripEventsListView from '../view/trip-events-list';
import NoPointView from '../view/no-route-point';
import LoadingView from '../view/loading';
import PointPresenter, {State as PointPresenterViewState} from './point';
import PointNewPresenter from './point-new';
import {remove, render, RenderPosition} from '../utils/render';
import {SortType, UpdateType, UserAction, FilterType} from '../utils/const';
import {sortPointByTime, sortPointByPrice, sortPointByDay} from '../utils/point';
import {filter} from '../utils/filter';

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._pointPresenter = {};
    this._api = api;

    this._currentSortType = SortType.DAY;
    this._isLoading = true;

    this._sortComponent = null;
    this._tripComponent = new TripEventsListView();
    this._noPointComponent = new NoPointView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._tripComponent, this._handleViewAction);
  }

  init() {
    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._tripComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPointByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointByTime);
    }

    return filteredPoints.sort(sortPointByDay);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(updateType);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._getPoints().forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderLoading() {
    render(this._tripComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoints() {
    render(this._tripComponent, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noPointComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getPoints().length === 0) {
      this._renderNoPoints();
    } else {
      this._renderSort();
      render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    }

    this._renderPoints();
  }
}
