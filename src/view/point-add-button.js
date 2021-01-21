import AbstractView from "./abstract.js";

const createPointAddButtonTemplate = () => {
  return `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>`;
};

export default class PointAddButton extends AbstractView {
  constructor() {
    super();

    this._addButtonClickHandler = this._addButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createPointAddButtonTemplate();
  }

  makeEnabled() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  makeDisabled() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  }

  _addButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick();
  }

  setAddButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.getElement().addEventListener(`click`, this._addButtonClickHandler);
  }
}
