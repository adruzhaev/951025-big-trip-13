import {createRouteInfoTemplate} from './view/route-info';
import {createMainMenuTemplate} from './view/menu';
import {createFiltersTemplate} from './view/filters';
import {createSortingTemplate} from './view/sorting';
import {createTripEventsContainerTemplate} from './view/trip-events-container';
import {createRoutePointTemplate} from './view/route-point';
import {createEditFormTemplate} from './view/edit-form';
import {createPointTemplate} from './view/creation-point-form.js';

const ROUTE_POINTS_NUMBER = 3;

const render = (container, template, place) => {
  return container.insertAdjacentHTML(place, template);
};

const siteMainHeaderElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainHeaderElement.querySelector(`.trip-main__trip-controls`);

const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(siteMainHeaderElement, createRouteInfoTemplate(), `afterbegin`);
render(siteControlsElement, createMainMenuTemplate(), `afterbegin`);
render(siteControlsElement, createFiltersTemplate(), `beforeend`);

render(siteTripEventsElement, createSortingTemplate(), `afterbegin`);
render(siteTripEventsElement, createTripEventsContainerTemplate(), `beforeend`);

const tripEventsListElement = siteTripEventsElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, createEditFormTemplate(), `afterbegin`);
render(tripEventsListElement, createPointTemplate(), `afterbegin`);

for (let i = 0; i < ROUTE_POINTS_NUMBER; i++) {
  render(tripEventsListElement, createRoutePointTemplate(), `beforeend`);
}
