import AbstractView from "./abstract";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Method restoreHandlers should be implemented`);
  }

  unpdateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData(update, isDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (isDataUpdating) {
      return;
    }

    this.unpdateElement();
  }
}
