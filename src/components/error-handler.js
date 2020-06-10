import { subscribe } from '../services/observer';
import { SHOW_ERROR } from '../constants';

export default class ErrorHandling {
  constructor() {
    this.wrapper = document.getElementById('root-banner');
    this.errorTextWrapper = document.getElementById('banner-error');
    this.closeBtn = document.getElementById('close-banner-btn');

    this.init();
  }

  addError = (errorText) => {
    const text = document.createTextNode(errorText || 'An error occured, please try again or contact us');
    this.errorTextWrapper.innerHTML = '';
    this.errorTextWrapper.appendChild(text);
    
    this.wrapper.classList.remove('is-hidden');
  };

  removeError = () => {
    this.wrapper.classList.add('is-hidden');
  };
  
  init = () => {
    // show error on error event
    subscribe(SHOW_ERROR, this.addError);

    this.closeBtn.addEventListener('click', this.removeError);
  }
}
