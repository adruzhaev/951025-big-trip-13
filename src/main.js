import RouteInfoView from './view/trip-info';
import MenuView from './view/menu';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import StatView from './view/statistics';
import {render, RenderPosition, remove} from '../src/utils/render';
import {MenuItem, UpdateType, FilterType} from './const';
import Api from './api';

const AUTHORIZATION = `Basic asdAWWe291nA2Na2k01`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const siteMainHeaderElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainHeaderElement.querySelector(`.trip-main__trip-controls`);
const siteMenuComponent = new MenuView();

// render(siteMainHeaderElement, new RouteInfoView(points), RenderPosition.AFTERBEGIN);
render(siteControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

const siteTripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteTripEventsElement, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteControlsElement, filterModel);

let statisticComponent = null;

const handleSiteMenuClick = (menuItem) => {
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
      statisticComponent = new StatView(pointsModel);
      render(siteTripEventsElement, statisticComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

filterPresenter.init();
tripPresenter.init();

api.getAll()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    render(siteMainHeaderElement, new RouteInfoView(points), RenderPosition.AFTERBEGIN);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });
