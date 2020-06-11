import { publish } from '../services/observer';
import { RESET_PAGES } from '../constants';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// https://davidwalsh.name/javascript-debounce-function
const debounce = (func, wait, immediate) => {
  var timeout;
  return function() {
      var context = this, args = arguments;
      var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
  };
};

export default class Search {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.wrapper = document.getElementById('root-search');

    this.init();
  }

  getSearchKeyWord = () => this.searchInput.value;

  clearSearch = () => {
    this.searchInput.value = '';
  }

  search = async () => {
    publish(RESET_PAGES, this.searchInput.value);
  }

  // since the search wrapper is not dynamic it's more efficient
  // to show/hide it than re-create / re-attach listeners / re-attach subscriptions
  show = () => {
    this.wrapper.classList.remove('is-hidden');
  }

  hide = () => {
    this.wrapper.classList.add('is-hidden');
  }

  init = () => {
    const searchListener = debounce(() => {
      this.search();
    }, 250);

    this.searchInput.addEventListener('keyup', searchListener);
  }
} 
