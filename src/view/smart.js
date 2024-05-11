export default class Smart {
  updateElement() {
    const previousElement = this.getElement();
    const parentElement = previousElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parentElement.replaceChild(newElement, previousElement);
  }

  updateData(update, justStateUpdate) {
    if (!update) {
      return;
    }
    this._pointState = Object.assign({}, this._pointState, update);
    if (justStateUpdate) {
      return;
    }
    this.updateElement();
    this.restoreHandlers();
  }

  restoreListeners() {
    throw new Error("Abstract method not implemented: restoreListeners");
  }
}