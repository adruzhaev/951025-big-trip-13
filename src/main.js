import RouteInfoView from './view/route-info';
import MenuView from './view/menu';
import FiltersView from './view/filters';
import TripPresenter from './presenter/trip';
// import {createPointTemplate} from './view/creation-point-form.js';
import {generatePoint} from './mock/point';
import {render, RenderPosition} from '../src/utils/render';

const ROUTE_POINTS_NUMBER = 10;
const points = new Array(ROUTE_POINTS_NUMBER).fill().map(generatePoint);

const siteMainHeaderElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainHeaderElement.querySelector(`.trip-main__trip-controls`);

render(siteMainHeaderElement, new RouteInfoView(points), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new FiltersView(), RenderPosition.BEFOREEND);

const siteTripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteTripEventsElement);
tripPresenter.init(points);
