import { searchPeopleWithCount } from '../services/api';
import { publish, subscribe } from '../services/observer';
import { SYNC_ITEMS, RENDER_ITEMS, RESET_PAGES, DESTROY_CURRENT_VIEW, VIEWS } from '../constants';

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
  }

  search = async () => {
    const { people, count } = await searchPeopleWithCount(this.searchInput.value); // ?
    publish(SYNC_ITEMS, people);
    publish(RENDER_ITEMS, people);
    publish(RESET_PAGES, count);
  }

  // since the search wrapper is not dynamic it's more efficient
  // to show/hide it than re-create / re-attach listeners / re-attach subscriptions
  toggleVisibility = (prevView) => {
    if (prevView === VIEWS.OVERVIEW) {
      this.wrapper.classList.add('is-hidden');
    } else {
      this.wrapper.classList.remove('is-hidden');
    }
  }

  init = () => {
    subscribe(DESTROY_CURRENT_VIEW, this.toggleVisibility);

    const searchListener = debounce(() => {
      // will need to abort any prev requests
      this.search();
    }, 250);

    this.searchInput.addEventListener('keyup', searchListener);
  }
} 
