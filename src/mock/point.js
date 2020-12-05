import flatpickr from "flatpickr";
import {getRandomInt} from "../utils/common";
import {POINTTYPES, OFFERSTYPES, CITIES, OFFERSNAMES} from "../const";

const generatePointType = () => {
  const randomIndex = getRandomInt(0, POINTTYPES.length - 1);

  return POINTTYPES[randomIndex];
};

const generateOffersType = () => {
  const randomIndex = getRandomInt(0, OFFERSTYPES.length - 1);

  return OFFERSTYPES[randomIndex];
};

const generateDestination = () => {
  const randomIndex = getRandomInt(0, CITIES.length - 1);

  return CITIES[randomIndex];
};

const generateOfferName = () => {
  const randomIndex = getRandomInt(0, OFFERSNAMES.length - 1);

  return OFFERSNAMES[randomIndex];
};

const generateOffers = () => {

  const isOffers = getRandomInt(0, 1);

  if (!isOffers) {
    return null;
  }

  return {
    type: generateOffersType(),
    name: generateOfferName(),
    price: parseInt(getRandomInt(1, 200), 10),
  };
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

const generateDestinationInfo = () => {

  const isInfo = getRandomInt(0, 1);

  if (!isInfo) {
    return null;
  }

  return {
    description: generateDescription(),
    photos: generatePhotos(),
  };
};

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generatePoint = () => {
  return {
    pointType: generatePointType(),
    destinationName: generateDestination(),
    startTimeEvt: randomDate(new Date(), new Date(2040, 1, 0)),
    endTimeEvt: flatpickr.formatDate(new Date(), `d/m/y H:i`),
    price: parseInt(getRandomInt(1, 1000), 10),
    offers: generateOffers(),
    destinationInfo: generateDestinationInfo(),
  };
};

