export const POINT_COUNT = 20;

export const TRUE_FLAG = true;

export const FlagMode = {
  TRUE: true,
  FALSE: false,
};

export const DESCRIPTION_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus";

export const types = [
  "taxi",
  "bus",
  "train",
  "ship",
  "transport",
  "drive",
  "flight",
  "check-in",
  "sightseeing",
  "restaurant",
];

export const towns = ["Amsterdam", "Geneva", "Chamonix", "Havana", "New York"];

export const offers = [
  {
    title: "Rent a car",
    price: 200,
  },
  {
    title: "Add luggage",
    price: 30,
  },
  {
    title: "Switch to comfort",
    price: 100,
  },
  {
    title: "Order Uber",
    price: 20,
  },
  {
    title: "Add breakfast",
    price: 50,
  },
  {
    title: "Add meal",
    price: 15,
  },
  {
    title: "Choose seats",
    price: 5,
  },
  {
    title: "Travel by train",
    price: 40,
  },
];

export const BasePrice = {
  MIN: 20,
  MAX: 1400,
};

export const Gap = {
  MIN: 0,
  MAX: 5,
};

export const SentenceCount = {
  MIN_SENTECES: 0,
  MAX_SENTECES: 5,
};

export const Period = {
  START_DATE_MIN: -7,
  START_DATE_MAX: -1,
  DATE_FROM_MIN: 60,
  DATE_FROM_MAX: 120,
  DATE_TO_MIN: 30,
  DATE_TO_MAX: 1500,
};

export const TimeFormat = {
  MILLISECOND_IN_HOUR: 3600000,
  MILLISECOND_IN_DAY: 86400000,
  MILLISECOND_IN_MINUT: 60000,
};

export const SortType = {
  DAY: "day",
  TIME: "time",
  PRICE: "price",
};

export const UserAction = {
  UPDATE_POINT: "UPDATE_POINT",
  ADD_POINT: "ADD_POINT",
  DELETE_POINT: "DELETE_POINT",
};

export const UpdateType = {
  PATCH: "PATCH", //изменение одной карточки
  MINOR: "MINOR", //изменение всего списка карточек
  MAJOR: "MAJOR", //перерисовка всей доски целиком
};

export const FilterType = {
  EVERYTHING: "everything",
  FUTURE: "future",
  PAST: "past",
};

export const Index = {
  PREVIOUS: -1,
  NEXT: 1,
};

export const MenuItem = {
  NEW_EVENT: "new-event",
  TABLE: "table",
  STATS: "stats",
};

export const Tag = {
  INPUT: "INPUT",
  A: "A",
  BUTTON: "BUTTON",
};
