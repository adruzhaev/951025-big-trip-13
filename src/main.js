import RouteInfoView from './view/route-info';
import MenuView from './view/menu';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
// import {createPointTemplate} from './view/creation-point-form.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import StatView from './view/statistics';
import {generatePoint} from './mock/point';
import {render, RenderPosition, remove} from '../src/utils/render';
import {MenuItem, UpdateType, FilterType} from './const';

const ROUTE_POINTS_NUMBER = 10;
const points = new Array(ROUTE_POINTS_NUMBER).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const siteMainHeaderElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainHeaderElement.querySelector(`.trip-main__trip-controls`);
const siteMenuComponent = new MenuView();

render(siteMainHeaderElement, new RouteInfoView(points), RenderPosition.AFTERBEGIN);
render(siteControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

const siteTripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteTripEventsElement, pointsModel, filterModel);
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

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
