import PointView from '../view/trip-point';
import PointEditView from '../view/edit-route-point-form';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {UserAction, UpdateType} from '../const';
import {isDatesEqual} from '../utils/point';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITTING: `EDITTING`,
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
};

export default class Point {
  constructor(tripComponent, changeData, changeMode) {
    this._tripComponent = tripComponent;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditFormClick = this._handleEditFormClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point) {

    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._pointEditComponent;
    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setEditClickHandler(this._handleEditFormClick);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._tripComponent, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITTING) {
      replace(this._pointComponent, prevEditPointComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  _replacePointToEditForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITTING;
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceEditFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToEditForm();
  }

  _handleEditFormClick() {
    this._pointEditComponent.reset(this._point);
    this._replaceEditFormToPoint();
  }

  _handleFormSubmit(update) {
    const isMinorUpdate = !isDatesEqual(this._point.date, update.date);
    this._changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update
    );

  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }
}
