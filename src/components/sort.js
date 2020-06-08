import { publish, subscribe } from '../services/observer';
import { RENDER_ITEMS, SYNC_ITEMS, DESTROY_CURRENT_VIEW, VIEWS } from '../constants';

const sortArrAscByProp = (arr, propName) => {
  if (!arr || !arr.length) {
    return [];
  }

  const sorted = arr.sort((a, b) => {
    if (!a[propName] || !b[propName]) {
      return 0;
    }

    if (a[propName] < b[propName]) {
      return -1;
    }

    if (a[propName] > b[propName]) {
      return 1;
    }

    return 0;
  });
  return [...sorted];
};

const sortDescAscByProp = (arr, propName) => {
  if (!arr || !arr.length) {
    return [];
  }

  const sorted = arr.sort((a, b) => {
    if (!a[propName] || !b[propName]) {
      return 0;
    }

    if (a[propName] < b[propName]) {
      return 1;
    }

    if (a[propName] > b[propName]) {
      return -1;
    }

    return 0;
  });
  return [...sorted];
};

const reverseArrSorting = (arr) => {
  if (!arr || !arr.length) {
    return [];
  }

  return [...arr.reverse()];
};

export default class Sort {
  constructor(propName) {
    this.items = [];
    this.propName = propName;
    this.isSorted = false;
    // use 1 (ascending) & -1 (descending) for sort direction
    // to toggle it easily with the default asc
    this.direction = 1;
    this.wrapper = document.getElementById('sort-btn');
  }

  sort = () => {
    if (!this.items) {
      return;
    }

    if (this.direction === 1) {
      publish(RENDER_ITEMS, sortArrAscByProp(this.items, this.propName));
    } else {
      publish(RENDER_ITEMS, sortDescAscByProp(this.items, this.propName));
    }
  }

  toggleSort = () => {
    if (!this.items) {
      return;
    }

    this.direction = -this.direction;

    // simply reverse the arr since it's already sorted
    publish(RENDER_ITEMS, reverseArrSorting(this.items));
  }
  
  addSortListeners = () => {
    this.wrapper.addEventListener('click', this.toggleSort);
  }

  syncItems = (items) => {
    this.items = items;
    this.sort();
  }

  // since the sort wrapper is not dynamic it's more efficient
  // to show/hide it than re-create / re-attach listeners / re-attach subscriptions
  toggleVisibility = (prevView) => {
    if (prevView === VIEWS.OVERVIEW) {
      this.wrapper.classList.add('is-hidden');
    } else {
      this.wrapper.classList.remove('is-hidden');
    }
  }

  init = () => {
    // re-sort items on sync
    subscribe(SYNC_ITEMS, this.syncItems);
    subscribe(DESTROY_CURRENT_VIEW, this.toggleVisibility);

    this.addSortListeners();

    // by default sort asc
    publish(RENDER_ITEMS, sortArrAscByProp(this.items, this.propName));
  }
} 
