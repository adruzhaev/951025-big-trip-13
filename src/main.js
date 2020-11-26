import {createRouteInfoTemplate} from './view/route-info';
import {createMainMenuTemplate} from './view/menu';
import {createFiltersTemplate} from './view/filters';
import {createSortingTemplate} from './view/sorting';
import {createTripEventsContainerTemplate} from './view/trip-events-container';
import {createRoutePointTemplate} from './view/route-point';
import {createEditFormTemplate} from './view/edit-point-form';
// import {createPointTemplate} from './view/creation-point-form.js';
import {generatePoint} from './mock/point';

const ROUTE_POINTS_NUMBER = 15;

const points = new Array(ROUTE_POINTS_NUMBER).fill().map(generatePoint);

const render = (container, template, place) => {
  return container.insertAdjacentHTML(place, template);
};

const siteMainHeaderElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainHeaderElement.querySelector(`.trip-main__trip-controls`);

const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(siteMainHeaderElement, createRouteInfoTemplate(points), `afterbegin`);
render(siteControlsElement, createMainMenuTemplate(), `afterbegin`);
render(siteControlsElement, createFiltersTemplate(), `beforeend`);

render(siteTripEventsElement, createSortingTemplate(), `afterbegin`);
render(siteTripEventsElement, createTripEventsContainerTemplate(), `beforeend`);

const tripEventsListElement = siteTripEventsElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, createEditFormTemplate(points[0]), `afterbegin`);
// render(tripEventsListElement, createPointTemplate(points[0]), `afterbegin`);

for (let i = 1; i < ROUTE_POINTS_NUMBER; i++) {
  render(tripEventsListElement, createRoutePointTemplate(points[i]), `beforeend`);
}
