export default class Store {
  constructor() {
    this._offers = null;
    this._destinations = null;
  }

  static setOffers(offers) {
    this._offers = offers;
  }

  static setDestinations(destinations) {
    this._destinations = destinations;
  }

  static getOffers() {
    return this._offers;
  }

  static getDestinations() {
    return this._destinations;
  }
}
