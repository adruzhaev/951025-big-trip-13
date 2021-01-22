import PointNewView from '../view/create-point-form';
import {render, RenderPosition, remove} from '../utils/render';
import {UserAction, UpdateType} from '../utils/const';

export default class PointNew {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointNewComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._pointNewComponent !== null) {
      return;
    }

    this._pointNewComponent = new PointNewView();
    this._pointNewComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointNewComponent.setCancelClickHandler(this._handleCancelClick);

    render(this._pointListContainer, this._pointNewComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointNewComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointNewComponent);
    this._pointNewComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._pointNewComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointNewComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._pointNewComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

