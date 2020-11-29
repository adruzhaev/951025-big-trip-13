import RouteInfoView from './view/route-info';
import MenuView from './view/menu';
import FiltersView from './view/filters';
import SortView from './view/sorting';
import TripEventsListView from './view/trip-events-list';
import PointView from './view/route-point';
import PointEditView from './view/edit-point-form';
import NoPointView from './view/no-route-point';
// import {createPointTemplate} from './view/creation-point-form.js';
import {generatePoint} from './mock/point';
import {render, RenderPosition} from './utils';

const ROUTE_POINTS_NUMBER = 10;
const points = new Array(ROUTE_POINTS_NUMBER).fill().map(generatePoint);

const siteMainHeaderElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainHeaderElement.querySelector(`.trip-main__trip-controls`);

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new PointEditView(point);

  const replacePointToEditForm = () => {
    pointListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceEditFormToPoint = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEditFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

render(siteMainHeaderElement, new RouteInfoView(points).getElement(), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

if (points.length === 0) {
  render(siteTripEventsElement, new NoPointView().getElement(), RenderPosition.AFTERBEGIN);
} else {
  render(siteTripEventsElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);
  render(siteTripEventsElement, new TripEventsListView().getElement(), RenderPosition.BEFOREEND);
}

const tripEventsListElement = siteTripEventsElement.querySelector(`.trip-events__list`);

// renderTemplate(tripEventsListElement, createPointTemplate(points[0]), `afterbegin`);

for (let i = 0; i < points.length; i++) {
  renderPoint(tripEventsListElement, points[i]);
}
