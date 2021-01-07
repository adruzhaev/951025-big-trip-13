import AbstractView from "./abstract";

const createFilterTemplate = (filter, currentFilterType) => {

  const {type, name} = filter;

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${name.toLowerCase()}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${name.toLowerCase()}"
        ${type === currentFilterType ? `checked` : ``}
      />
      <label class="trip-filters__filter-label"
        for="filter-${name.toLowerCase()}">${name}
      </label>
    </div>`;
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  // const filters = [`Everything`, `Future`, `Past`];
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterTemplate(filter, currentFilterType))
    .join(``);

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
