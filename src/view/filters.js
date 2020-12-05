import AbstractView from "./abstract";

const createFilterTemplate = (filterName) => {
  return `
    <div class="trip-filters__filter">
      <input id="filter-${filterName.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName.toLowerCase()}" checked>
      <label class="trip-filters__filter-label" for="filter-${filterName.toLowerCase()}">${filterName}</label>
    </div>`;
};

const createFiltersTemplate = () => {
  const filters = [`Everything`, `Future`, `Past`];

  return `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterTemplate(filter)).join(``)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filter extends AbstractView {
  getTemplate() {
    return createFiltersTemplate();
  }
}
