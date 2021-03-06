import he from 'he';
import SmartView from "./smart";
import {POINTTYPES} from "../utils/const";
import flatpickr from "flatpickr";
import dayjs from "dayjs";
import StoreData from '../api/store-data';

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  type: `taxi`,
  destinationName: ``,
  destinationDescription: null,
  destinationPhotos: null,
  date: {
    startTime: new Date(),
    endTime: new Date(),
  },
  price: 0,
  offers: [],
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
        <label
          class="event__type-label  event__type-label--${pointType.toLocaleLowerCase()}"
          for="event-type-${pointType.toLocaleLowerCase()}-1"
        >${pointType}</label>
      </div>
    `;
  }).join(``);
};

const createOffersTemplate = (activeType, activeOffers) => {
  const {offers} = StoreData.getOffers().find((offer) => offer.type === activeType);
  return `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${offers.map(({title, price}) => {
    const isActiveOffer = activeOffers.find((offer) => offer.title === title) ? `checked` : ``;
    return (`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden"
          id="event-offer-${title.split(` `).join(`-`)}" type="checkbox"
          data-value="${title}"
          name="event-offer-${title.split(` `).join(`-`)}"
          ${isActiveOffer}
        >
        <label class="event__offer-label" for="event-offer-${title.split(` `).join(`-`)}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>
    `);
  }).join(``)}
  </div>`;
};

const renderPhotos = (photos) => {
  return photos.map((photo) => {
    return `
      <img class="event__photo" src="${photo.src}" alt="${photo.description}">
    `;
  }).join(``);
};

const createCitiesTemplate = () => {
  const cities = StoreData.getDestinations().map((destination) => destination.name);
  return cities.map((city) => {
    return `<option value="${city}"></option>`;
  }).join(``);
};

const creatDestinationTemplate = (destinationDescription, destinationPhotos) => {

  const description = destinationDescription !== null ? destinationDescription : ``;
  const photos = destinationPhotos !== null ? renderPhotos(destinationPhotos) : ``;

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos}
        </div>
      </div>
    </section>
  `;
};

const createEditFormTemplate = (data) => {

  const {type, destinationName, price, date, offers, destinationDescription, destinationPhotos, isDescription, isPhotos, isOffers, isDisabled, isSaving, isCanceling} = data;

  const pointTypesTemaplate = createPointTypeTemplate(type);
  const offersTemplate = isOffers ? createOffersTemplate(type, offers) : ``;
  const destinationTemplate = !isDescription && !isPhotos ? `` : creatDestinationTemplate(destinationDescription, destinationPhotos);
  const startTime = dayjs(date.startTime).format(`DD/MM/YYYY HH:MM`);
  const endTime = dayjs(date.endTime).format(`DD/MM/YYYY HH:MM`);
  const cities = createCitiesTemplate();

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLocaleLowerCase()}.png" alt="Event type icon">
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
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" name="event-destination-1" value="${he.encode(destinationName)}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${cities}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(String(price))}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isCanceling ? `Canceling...` : `Cancel`}</button>
      </header>
      <section class="event__details">

        <section class="event__section  event__section--offers">
          ${offersTemplate}
        </section>

        ${destinationTemplate}
      </section>
    </form>
  </li>`;
};

export default class PointNew extends SmartView {
  constructor(point = BLANK_POINT) {
    super();
    this._data = PointNew.parsePointToData(point);
    this._datepicker = null;
    this._offersStore = StoreData.getOffers();

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCancelClickHandler = this._formCancelClickHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(point) {
    this.updateData(
        PointNew.parseDataToPoint(point)
    );
  }

  getTemplate() {
    return createEditFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCancelClickHandler(this._callback.deleteClick);
  }

  _setDatePicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._data.date.startTime) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`#event-start-time-1`),
          {
            dateFormat: `d/m/Y H:i`,
            defaultDate: this._data.date.startTime,
            onChange: this._startDateChangeHandler
          }
      );
    }

    if (this._data.date.endTime) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`#event-end-time-1`),
          {
            dateFormat: `d/m/Y H:i`,
            defaultDate: this._data.date.endTime,
            onChange: this._endDateChangeHandler
          }
      );
    }
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      date: Object.assign(
          {},
          this._data.date,
          {
            startTime: dayjs(userDate).hour(23).minute(59).second(59).toDate()
          }
      )
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      date: Object.assign(
          {},
          this._data.date,
          {
            endTime: dayjs(userDate).hour(23).minute(59).second(59).toDate()
          }
      )
    });
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._pointTypeChangeHandler);

    this.getElement()
      .querySelector(`.event__section--offers`)
      .addEventListener(`change`, this._offersChangeHandler);

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);

    this.getElement()
      .querySelector(`.event__field-group--price`)
      .addEventListener(`change`, this._priceChangeHandler);
  }

  _pointTypeChangeHandler(evt) {
    evt.preventDefault();
    const {type, offers} = this._offersStore.find((offer) => offer.type === evt.target.value);
    this.updateData(
        {
          type,
          offers: [],
          isOffers: offers.length > 0 ? true : false,
        }
    );
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();

    const offerTitle = evt.target.dataset.value;
    const {offers} = this._offersStore.find((store) => store.type === this._data.type);
    const currentOffer = offers.find((offer) => offer.title === offerTitle);
    const currentOffers = !this._data.offers.find((offer) => offer.title === offerTitle) ?
      [...this._data.offers.slice(), currentOffer] :
      this._data.offers.filter((offer) => offer.title !== offerTitle);

    this.updateData({
      offers: currentOffers,
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const newDestination = StoreData.getDestinations().find((place) => place.name === evt.target.value);

    if (!newDestination) {
      evt.target.setCustomValidity(`Выберите город из предложенного списка`);

      return;
    }

    this.updateData({
      destinationName: newDestination.name,
      destinationDescription: newDestination.description,
      destinationPhotos: newDestination.pictures,
      isPhotos: newDestination.pictures ? true : false,
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      price: Number(evt.target.value)
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointNew.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _formCancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointNew.parseDataToPoint(this._data));
  }

  setCancelClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formCancelClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isOffers: point.offers.length > 0,
          isDescription: point.destinationPhotos !== null,
          isPhotos: point.destinationPhotos !== null,
          isDisabled: false,
          isSaving: false,
          isCanceling: false,
        }
    );
  }

  static parseDataToPoint(data) {
    const point = Object.assign(
        {},
        data
    );

    delete point.isOffers;
    delete point.isDescription;
    delete point.isPhotos;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isCanceling;

    return point;
  }
}
