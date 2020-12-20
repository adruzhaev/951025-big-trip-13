import PointView from '../view/route-point';
import PointEditView from '../view/edit-route-point-form';
import {render, RenderPosition, replace, remove} from '../utils/render';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITTING: `EDITTING`,
};

export default class Point {
  constructor(tripComponent, changeData, changeMode) {
    this._tripComponent = tripComponent;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditFormClick = this._handleEditFormClick.bind(this);
  }

  init(point) {

    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._pointEditPointComponent;
    this._pointComponent = new PointView(point);
    this._pointEditPointComponent = new PointEditView(point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditPointComponent.setEditClickHandler(this._handleEditFormClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._tripComponent, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITTING) {
      replace(this._pointEditPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  _replacePointToEditForm() {
    replace(this._pointEditPointComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITTING;
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._pointEditPointComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._pointEditPointComponent.reset(this._point);
      this._replaceEditFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToEditForm();
  }

  _handleEditFormClick() {
    this._pointEditPointComponent.reset(this._point);
    this._replaceEditFormToPoint();
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceEditFormToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }
}
