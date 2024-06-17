import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import {createEditEventFormTemplate} from './edit-event-form.tpl';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

import 'flatpickr/dist/flatpickr.min.css';
import {DEFAULT_POINT, DEFAULT_OFFERS, DEFAULT_DESTINATION} from './default-data.js';
import DestinationsModel from '../../models/destinations-model.js';
import DestinationsApiService from '../../services/api/destinations-api-service.js';
const AUTHORIZATION = 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=';
const END_POINT = 'https://20.objects.htmlacademy.pro/big-trip';
export default class EditEventFormView extends AbstractStatefulView {
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(point, offers, destinations) {
    super();

    if (!offers?.length) {
      point = DEFAULT_POINT;
      offers = DEFAULT_OFFERS;
      destinations = DEFAULT_DESTINATION;
    }

    const destinationsModel = new DestinationsModel(
      new DestinationsApiService(END_POINT, AUTHORIZATION)
    );

    destinationsModel.init().then(() => {
      const id = destinationsModel.destinationsId;

      // Обновление переменной DEFAULT_DESTINATION
      const updatedDefaultDestination = DEFAULT_DESTINATION.map(
        (destination) => ({
          ...destination,
          id: id,
        })
      );

      // Обновление переменной DEFAULT_POINT
      DEFAULT_POINT.destination.id = id;
      return updatedDefaultDestination;
    });

    this._state = EditEventFormView.parseDataToState(
      point,
      offers,
      destinations
    );
    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  get template() {
    return createEditEventFormTemplate(
      this._state.point,
      this._state.offers,
      this._state.destinations
    );
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  //Метод для сброса несохранённых данных. (Используется когда форма редактирования открыта и пользователь нажимает на Esc либо на кнопку закрытия задачи)
  reset = (pointData, offersData, destinationsData) => {
    const selectedDestination = destinationsData.find(
      (destination) => destination.id === pointData.destination.id
    );
    this.updateElement(
      EditEventFormView.parseDataToState(
        {
          ...pointData,
          destination: selectedDestination, // сохраняем выбранный пункт назначения в состоянии
        },
        offersData,
        destinationsData
      )
    );
  };

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#pointDeleteClickHandler);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditFormClickHandler(this._callback.closeEditFormClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #changeBasePriceInputHandler = (evt) => {
    //Реализация добавления только цифр в input
    evt.preventDefault();
    if (evt.data === '-' || evt.data === '+' || evt.data === 'e') {
      evt.target.value = '';
    }

    evt.target.value = evt.target.value.replace(/^0/, '');

    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.value,
      },
      offers: [...this._state.offers],
    });
  };

  #changeCityDestinationHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this._state.destinations.find(
      (destination) => destination.name === evt.target.value
    );
    if (selectedDestination) {
      this.updateElement({
        point: {
          ...this._state.point,
          destination: {
            id: selectedDestination.id,
            name: selectedDestination.name,
            pictures: selectedDestination.pictures,
            description: selectedDestination.description,
          },
        },
        offers: [...this._state.offers],
        destinations: [...this._state.destinations],

      });
    }
  };

  #clearCityDestinationInputHandler = (evt) => {
    evt.preventDefault();
    evt.target.value = '';
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const id = this._state.point.destination.id; // Получаем id из выбранного пункта назначения
    const data = EditEventFormView.parseStateToData(
      this._state.point,
      this._state.offers,
      this._state.destinations,
      id // Передаем id в данные для отправки на сервер
    );
    this._callback.formSubmit(data);
  };

  #dateFromChangeHandler = ([userDateFrom]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateFrom: userDateFrom,
      },
      offers: [...this._state.offers],
    });
  };

  #dateToChangeHandler = ([userDateTo]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateTo: userDateTo,
      },
      offers: [...this._state.offers],
    });
  };

  //Метод для обработки смены точки маршрута с обновлением количества офферов для каждого типа
  #changeCurrentType = (evt) => {
    evt.preventDefault();
    if (evt.target.className.includes('event__type-label')) {
      if (evt.target.innerHTML !== this._state.point.type) {
        const newType = evt.target.innerHTML;
        this.updateElement({
          point: {
            ...this._state.point,
            type: newType,
            offers: [],
          },
          offers: [...this._state.offers],
        });
      }
    }
  };

  //Метод для обработки выбора дополнительных опций
  #pickOffers = (evt) => {
    if (evt?.target?.id.includes('event-offer')) {
      let pickedOffers = this._state.point.offers;
      const offerId = evt?.target?.id.replace('event-offer-', '');
      const offerNumberId = Number(evt?.target?.id.replace('event-offer-', ''));
      if (
        typeof offerNumberId === Number &&
        pickedOffers.includes(offerNumberId)
      ) {
        const refreshedOffers = pickedOffers.filter(
          (offer) => offer !== offerNumberId
        );
        pickedOffers = refreshedOffers;
      } else if (
        typeof offerNumberId !== Number &&
        !pickedOffers.includes(offerNumberId)
      ) {
        pickedOffers.push(offerNumberId);
      }

      if (pickedOffers.includes(offerId)) {
        const refreshedOffers = pickedOffers.filter(
          (offer) => offer !== offerId
        );
        pickedOffers = refreshedOffers;
      } else if (!pickedOffers.includes(offerId)) {
        pickedOffers.push(offerId);
      }

      this.updateElement({
        point: {
          ...this._state.point,
          offers: pickedOffers,
        },
        offers: [...this._state.offers],
      });
    }
  };

  #setDateFromPicker = () => {
    if (dayjs(this._state.point.dateFrom).diff(this._state.point.dateTo) > 0) {
      this._state.point.dateTo = this._state.point.dateFrom;
    }
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: 'today',
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromChangeHandler, // На событие flatpickr передаётся колбэк
      }
    );
  };

  #setDateToPicker = () => {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.point.dateFrom,
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToChangeHandler, // На событие flatpickr передаётся колбэк
      }
    );
  };

  #setInnerHandlers = () => {
    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#changeCurrentType);

    const offersElement = this.element.querySelector(
      '.event__available-offers'
    );
    if (offersElement) {
      offersElement.addEventListener('click', this.#pickOffers);
    }
    this.element
      .querySelector('#event-price-1')
      .addEventListener('input', this.#changeBasePriceInputHandler);
    this.element
      .querySelector('#event-destination-1')
      .addEventListener('change', this.#changeCityDestinationHandler);
    this.element
      .querySelector('#event-destination-1')
      .addEventListener('focus', this.#clearCityDestinationInputHandler);
  };

  #pointDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(
      EditEventFormView.parseStateToData(
        this._state.point,
        this._state.offers,
        this._state.destinations
      )
    );
  };

  static parseDataToState = (pointData, offersData, destinationsData) => ({
    point: {
      ...pointData,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    },

    offers: [...offersData],
    destinations: [...destinationsData],
  });

  static parseStateToData = (statePoint, stateOffers, stateDestinations) => {
    const point = { ...statePoint };
    const offers = { ...stateOffers };
    const destinations = { ...stateDestinations };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return {
      point,
      offers,
      destinations,
    };
  };

  setCloseEditFormClickHandler(callback) {
    this._callback.closeEditFormClick = callback;
    this.element
      .querySelector('form .event__rollup-btn')
      .addEventListener('click', this.#closeEditFormClickHandler);
  }

  #closeEditFormClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeEditFormClick();
  };
}
