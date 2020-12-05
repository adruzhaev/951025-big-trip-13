import AbstractView from "./abstract";

const createSortingTypeTemplate = (sortingTypeName) => {
  return `
    <div class="trip-sort__item  trip-sort__item--${sortingTypeName.toLowerCase()}">
      <input id="sort-${sortingTypeName.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortingTypeName.toLowerCase()}" checked>
      <label class="trip-sort__btn" for="sort-${sortingTypeName.toLowerCase()}">${sortingTypeName}</label>
    </div>
  `;
};

export const createSortingTemplate = () => {
  const sortingTypes = [`Day`, `Event`, `Time`, `Price`, `Offers`];

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${sortingTypes.map((sortingType) => createSortingTypeTemplate(sortingType)).join(``)}
  </form>`;
};

export default class Sort extends AbstractView {
  getTemplate() {
    return createSortingTemplate();
  }
}
