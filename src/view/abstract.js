import {createElement} from "../utils/render";

const SHAKE_ANIMATION_TIMEOUT = 600;
export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract!`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Method getTemplate should be implemented.`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
