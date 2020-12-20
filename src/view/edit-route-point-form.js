import SmartView from "./smart";
import {POINTTYPES, CITIES} from "../const";
import flatpickr from "flatpickr";
import {generateOffers, generateDestinationInfo} from "../mock/point";
import {capitalize} from "../utils/common";

const BLANK_POINT = {
  id: ``,
  pointType: ``,
  destinationName: ``,
  startTimeEvt: ``,
  endTimeEvt: ``,
  price: ``,
  offers: ``,
  destinationInfo: ``,
  isFavorite: false,
};

const createPointTypeTemplate = (currentPointType) => {
  return POINTTYPES.map((pointType) => {
    return `
      <div class="event__type-item">
        <input
          id="event-type-${pointType.toLocaleLowerCase()}-1"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${pointType.toLocaleLowerCase()}"
          ${currentPointType === pointType ? `checked` : ``}
        >
        <label class="event__type-label  event__type-label--${pointType.toLocaleLowerCase()}" for="event-type-${pointType.toLocaleLowerCase()}-1">${pointType}</label>
      </div>
    `;
  }).join(``);
};
const createOffersTemplate = (offers) => {
  return Object.entries(offers).map(([key, value]) => {

    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
          id="event-offer-${key.split(` `).join(`-`)}-1" type="checkbox"
          data-value="${key}"
          name="event-offer-${key.split(` `).join(`-`)}" ${value.isActive ? `checked` : ``}
        >
        <label class="event__offer-label" for="event-offer-${key.split(` `).join(`-`)}-1">
          <span class="event__offer-title">${key}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${value.price}</span>
        </label>
      </div>
    `;
  }).join(``);
};

const renderPhotos = (photos) => {
  return photos.map((photo) => {
    return `
      <img class="event__photo" src="${photo}" alt="Event photo">
    `;
  }).join(``);
};

const createCitiesTemplate = () => {
  return CITIES.map((city) => {
    return `<option value="${city}"></option>`;
  }).join(``);
};

const creatDestinationTemplate = (destination) => {
  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${renderPhotos(destination.photos)}
        </div>
      </div>
    </section>
  `;
};

const createEditFormTemplate = (data = {}) => {

  const {pointType, destinationName, price = ``, startTimeEvt, endTimeEvt, offers = null, destinationInfo} = data;
  const pointTypesTemaplate = createPointTypeTemplate(pointType);

  const offersTemplate = offers === null ? `` : createOffersTemplate(offers);
  const destination = destinationInfo === null ? `` : creatDestinationTemplate(destinationInfo);

  const startTime = flatpickr.formatDate(startTimeEvt, `d/m/y H:i`);
  const cities = createCitiesTemplate();

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType.toLocaleLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${pointTypesTemaplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${pointType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" name="event-destination-1" value="${destinationName}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${cities}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeEvt}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersTemplate === `` ? `` : `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersTemplate}
            </div>
          </section>
        `}
        ${destination}
      </section>
    </form>
  </li>`;
};

export default class PointEdit extends SmartView {
  constructor(point = BLANK_POINT) {
    super();
    // this._point = point;
    this._data = PointEdit.parsePointToData(point);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(point) {
    this.updateData(
        PointEdit.parseDataToPoint(point)
    );
  }

  getTemplate() {
    return createEditFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._pointTypeChangeHandler);

    if (this._data.offers !== null) {
      this.getElement()
        .querySelector(`.event__section--offers`)
        .addEventListener(`change`, this._offersChangeHandler);
    }

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);

    this.getElement()
      .querySelector(`.event__field-group--price`)
      .addEventListener(`change`, this._priceChangeHandler);
  }

  _pointTypeChangeHandler(evt) {
    const newOffers = generateOffers(capitalize(evt.target.value));
    evt.preventDefault();
    this.updateData({
      pointType: capitalize(evt.target.value),
      offers: newOffers,
    });
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      offers: Object.assign(
          {},
          this._data.offers,
          {[evt.target.dataset.value]: Object.assign(
              {},
              this._data.offers[evt.target.dataset.value],
              {isActive: evt.target.checked}
          )}
      )
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const newDistination = evt.target.value;

    if (!CITIES.includes(newDistination)) {
      evt.target.setCustomValidity(`Выберите город из предложенного списка`);

      return;
    }

    this.updateData({
      destinationInfo: generateDestinationInfo(),
    });
  }

  // not sure that it is needed to add
  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point
    );
  }

  static parseDataToPoint(data) {
    let point = Object.assign({}, data);

    delete point.isOffers;
    delete point.isDestinationInfo;

    return point;
  }
}
