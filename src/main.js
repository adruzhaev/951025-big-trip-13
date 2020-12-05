import RouteInfoView from './view/route-info';
import MenuView from './view/menu';
import FiltersView from './view/filters';
import SortView from './view/sorting';
import TripEventsListView from './view/trip-events-list';
import PointView from './view/route-point';
import PointEditView from './view/edit-route-point-form';
import NoPointView from './view/no-route-point';
// import {createPointTemplate} from './view/creation-point-form.js';
import {generatePoint} from './mock/point';
import {render, RenderPosition, replace} from '../src/utils/render';

const ROUTE_POINTS_NUMBER = 10;
const points = new Array(ROUTE_POINTS_NUMBER).fill().map(generatePoint);

const siteMainHeaderElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainHeaderElement.querySelector(`.trip-main__trip-controls`);

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new PointEditView(point);

  const replacePointToEditForm = () => {
    replace(pointEditComponent, pointComponent);
  };

  const replaceEditFormToPoint = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.setEditClickHandler(() => {
    replacePointToEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.setFormSubmitHandler(() => {
    replaceEditFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.setEditClickHandler(() => {
    replaceEditFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(pointListElement, pointComponent, RenderPosition.BEFOREEND);
};

render(siteMainHeaderElement, new RouteInfoView(points), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new FiltersView(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

const tripEventsListComponent = new TripEventsListView();

if (points.length === 0) {
  render(siteTripEventsElement, new NoPointView(), RenderPosition.AFTERBEGIN);
} else {
  render(siteTripEventsElement, new SortView(), RenderPosition.AFTERBEGIN);
  render(siteTripEventsElement, tripEventsListComponent, RenderPosition.BEFOREEND);
}

// renderTemplate(tripEventsListElement, createPointTemplate(points[0]), `afterbegin`);

for (let i = 0; i < points.length; i++) {
  renderPoint(tripEventsListComponent, points[i]);
}
