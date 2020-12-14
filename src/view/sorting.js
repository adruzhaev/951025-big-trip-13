import AbstractView from "./abstract";
// import {SortType} from '../const';

const sortingTypes = [`Day`, `Event`, `Time`, `Price`, `Offers`];

const createSortingTypeTemplate = (sortingTypeName, sortingType, currentSortType) => {

  return `
    <div class="trip-sort__item  trip-sort__item--${sortingTypeName.toLowerCase()}">
      <input id="sort-${sortingTypeName.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortingTypeName.toLowerCase()}" ${(currentSortType === sortingType) ? `checked` : ``}>
      <label class="trip-sort__btn" for="sort-${sortingTypeName.toLowerCase()}" data-sort-type=${sortingType}>${sortingTypeName}</label>
    </div>
  `;
};

export const createSortingTemplate = (currentSortType) => {

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortingTypes.map((sortingType) => createSortingTypeTemplate(sortingType, sortingType.toUpperCase(), currentSortType)).join(``)}
  </form>`;
};

export default class Sort extends AbstractView {
  constructor(sortType) {
    super();
    this._currentSortType = sortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortType);
  }

  _setSortType(sort) {
    this._currentSortType = sort;
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
