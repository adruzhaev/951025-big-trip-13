import RouteInfoView from './view/route-info';
import MenuView from './view/menu';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
// import {createPointTemplate} from './view/creation-point-form.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import {generatePoint} from './mock/point';
import {render, RenderPosition} from '../src/utils/render';

const ROUTE_POINTS_NUMBER = 10;
const points = new Array(ROUTE_POINTS_NUMBER).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const siteMainHeaderElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainHeaderElement.querySelector(`.trip-main__trip-controls`);

render(siteMainHeaderElement, new RouteInfoView(points), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);

const siteTripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteTripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteControlsElement, filterModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
