import MenuView from './view/menu';
import StatisticsView from './view/statistics';
import PointAddButtonView from './view/point-add-button';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import {render, RenderPosition, remove} from '../src/utils/render';
import {MenuItem, UpdateType, FilterType} from './utils/const';
import {toast} from './utils/toast/toast';
import {isOnline} from './utils/point';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

import TripInfoPresenter from './presenter/trip-info';

const AUTHORIZATION = `Basic asdAWWe291nA2Na2k01`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const siteMainHeaderElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainHeaderElement.querySelector(`.trip-main__trip-controls`);
const siteTripEventsElement = document.querySelector(`.trip-events`);
const siteMenuComponent = new MenuView();
const pointAddButtonComponent = new PointAddButtonView();

const tripPresenter = new TripPresenter(siteTripEventsElement, pointsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(siteControlsElement, pointsModel, filterModel);
const tripInfoPresenter = new TripInfoPresenter(siteMainHeaderElement, pointsModel);

tripInfoPresenter.init();

let statisticComponent = null;

const onSiteMenuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticComponent = new StatisticsView(pointsModel.getPoints());
      render(siteTripEventsElement, statisticComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

const onNewPointCloseHandler = () => {
  pointAddButtonComponent.makeEnabled();
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const handleAddButtonClick = () => {
  remove(statisticComponent);
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  if (!isOnline()) {
    toast(`You can't create new point offline`);
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
    return;
  }
  tripPresenter.createPoint(onNewPointCloseHandler);
  pointAddButtonComponent.makeDisabled();
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

filterPresenter.init();
tripPresenter.init();

apiWithProvider.getAll()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  })
  .finally(() => {
    render(siteControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    render(siteMainHeaderElement, pointAddButtonComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(onSiteMenuClickHandler);
    pointAddButtonComponent.setAddButtonClickHandler(handleAddButtonClick);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
