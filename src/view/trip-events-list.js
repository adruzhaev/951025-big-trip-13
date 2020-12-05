import AbstractView from "./abstract";

const createTripEventsContainerTemplate = () => {
  return `<ul class="trip-events__list"></ul`;
};

export default class TripEventsList extends AbstractView {
  getTemplate() {
    return createTripEventsContainerTemplate();
  }
}
