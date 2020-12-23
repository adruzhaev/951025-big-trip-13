import dayjs from "dayjs";
import {getRandomInt} from "../utils/common";
import {POINTTYPES, OFFERSTYPES, CITIES} from "../const";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generatePointType = () => {
  const randomIndex = getRandomInt(0, POINTTYPES.length - 1);

  return POINTTYPES[randomIndex];
};

const generateDestination = () => {
  const randomIndex = getRandomInt(0, CITIES.length - 1);

  return CITIES[randomIndex];
};

const generateDescription = () => {
  const descriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus`
  ];

  const randomDescription = descriptions.slice(getRandomInt(0, descriptions.length - 2), descriptions.length - 1);

  return randomDescription.toString();
};

const generatePhotos = () => {
  const photos = [`http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`];
  return photos.slice(getRandomInt(0, photos.length - 1), photos.length - 1);
};

export const generateDestinationInfo = () => {

  const isInfo = getRandomInt(0, 1);

  if (!isInfo) {
    return null;
  }

  return {
    description: generateDescription(),
    photos: generatePhotos(),
  };
};

export const generateOffers = (type) => {

  const offersList = OFFERSTYPES[type];

  if (offersList.length === 0) {
    return null;
  }

  const offers = {};

  offersList.forEach((sight) => {
    offers[sight] = {};
    offers[sight].price = parseInt(getRandomInt(1, 200), 10);
    offers[sight].isActive = Boolean(getRandomInt(0, 1));
  });

  return offers;
};

// const randomDate = (start, end) => {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
// };

const generateDates = () => {
  const maxDaysGap = 7;
  const durationStep = 3;
  const maxDurationDays = 7;

  const daysGap = getRandomInt(-maxDaysGap, maxDaysGap);
  const step = (maxDurationDays * 24) / (durationStep / 60);

  const startTimeEvt = dayjs().add(daysGap, `day`).add(getRandomInt(1, step) * durationStep, `minute`).toDate();
  const endTimeEvt = dayjs(startTimeEvt).add(getRandomInt(1, step) * durationStep, `minute`).toDate();

  return {
    startTimeEvt,
    endTimeEvt,
  };
};

export const generatePoint = () => {
  return {
    id: generateId(),
    pointType: generatePointType(),
    destinationName: generateDestination(),
    // startTimeEvt: randomDate(new Date(), new Date(2020, 1, 0)),
    // endTimeEvt: flatpickr.formatDate(new Date(), `d/m/y H:i`),
    date: generateDates(),
    price: parseInt(getRandomInt(1, 1000), 10),
    // offers: generateOffersArray(getRandomInt(0, 5)),
    offers: generateOffers(generatePointType()),
    destinationInfo: generateDestinationInfo(),
    isFavorite: Boolean(getRandomInt(0, 1)),
  };
};

