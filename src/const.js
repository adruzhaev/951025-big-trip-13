export const POINTTYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
export const CITIES = [`Amsterdam`, `Accra`, `Caracas`, `Doha`, `Kabul`];
export const OFFERSNAMES = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`, `Travel by train`];
export const OFFERSTYPES = {
  "Taxi": [`smoke in car`, `with child`, `waiting`],
  "Bus": [`add luggage`, `insurance`, `extra meal`],
  "Train": [`choose seats`, `insurance`, `extra meal`, `switch to comfort class`],
  "Ship": [`switch to comfort class`, `insurance`],
  "Transport": [],
  "Drive": [],
  "Flight": [`add luggage`, `switch to comfort class`, `insurance`, `with child`],
  "Check-in": [`choose room`, `switch to comfort class`, `book travel program`],
  "Sightseeing": [],
  "Restaurant": [`book parking lot`, `choose table`, `dish from the chef`],
};

export const SortType = {
  DAY: `DAY`,
  TIME: `TIME`,
  PRICE: `PRICE`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`,
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const MenuItem = {
  TABLE: `TABLE`,
  STATS: `STATS`,
};
