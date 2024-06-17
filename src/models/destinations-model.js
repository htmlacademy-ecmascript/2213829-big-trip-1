import Observable from '../framework/observable';
import {UpdateType} from '../consts';

export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = [];
  #id = null;

  constructor(destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get destinationsId() {
    return this.#id;
  }


  init = async () => {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      this.#destinations = destinations;

      // Выбираем первый id из полученных данных и присваиваем его #id
      if (destinations.length > 0) {
        this.#id = destinations[0].id;
      }
    } catch (err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };
}
