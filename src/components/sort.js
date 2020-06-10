import { publish, subscribe } from '../services/observer';
import { RENDER_ITEMS, SYNC_ITEMS, DEFAULT_SORT_PROP } from '../constants';

const CSS_CLASS_ASC = 'is-sorted-asc';
const CSS_CLASS_DESC = 'is-sorted-desc';

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
  constructor() {
    this.items = [];
    this.currentSortProp = DEFAULT_SORT_PROP;
    // use 1 (ascending) & -1 (descending) for sort direction
    // to toggle it easily with the default asc
    this.direction = 1;
    this.wrapper = document.getElementById('sort');

    this.init();
  }

  toggleClassNameByDirection = (buttonEl) => {
    const btn = buttonEl || document.querySelector(`button[data-sort=${this.currentSortProp}`);
    if (!btn) {
      return;
    }

    btn.classList.toggle(CSS_CLASS_ASC);
    btn.classList.toggle(CSS_CLASS_DESC);
  }

  addClassNameByDirection = (buttonEl) => {
    const btn = buttonEl || document.querySelector(`button[data-sort=${this.currentSortProp}`);
    if (!btn) {
      return;
    }

    const classByDirection = this.direction === 1 ? CSS_CLASS_ASC : CSS_CLASS_DESC;
    const prevSortBtn = document.querySelector(`.${CSS_CLASS_ASC}`) || document.querySelector(`.${CSS_CLASS_DESC}`);
    if (prevSortBtn) {
      prevSortBtn.classList.remove(CSS_CLASS_ASC, CSS_CLASS_DESC);
    }
    btn.classList.add(classByDirection);
  }

  sort = (btnEl) => {
    if (!this.items) {
      return;
    }

    this.addClassNameByDirection(btnEl);

    if (this.direction === 1) {
      publish(RENDER_ITEMS, sortArrAscByProp(this.items, this.currentSortProp));
    } else {
      publish(RENDER_ITEMS, sortDescAscByProp(this.items, this.currentSortProp));
    }
  }

  toggleSort = (btnEl) => {
    if (!this.items) {
      return;
    }

    this.toggleClassNameByDirection(btnEl);

    this.direction = -this.direction;
    // simply reverse the arr since it's already sorted
    publish(RENDER_ITEMS, reverseArrSorting(this.items));
  }
  
  addSortListeners = () => {
    this.wrapper.addEventListener('click', (e) => {
      if (e.target.matches('button')) {
        const sortProp = e.target.getAttribute('data-sort');
        if (!sortProp) {
          return;
        }

        if (sortProp === this.currentSortProp) {
          this.toggleSort(e.target);
        } else {
          this.currentSortProp = sortProp;
          this.direction = 1;
          this.sort(e.target);
        }
      }
    });
  }

  syncItems = (items) => {
    this.items = items;
    this.sort();
  }

  // since the sort wrapper is not dynamic it's more efficient
  // to show/hide it than re-create / re-attach listeners / re-attach subscriptions
  show = () => {
    this.wrapper.classList.remove('is-hidden');
  }

  hide = () => {
    this.wrapper.classList.add('is-hidden');
  }

  init = () => {
    // re-sort items on sync
    subscribe(SYNC_ITEMS, this.syncItems);

    this.addSortListeners();

    // by default sort asc
    publish(RENDER_ITEMS, sortArrAscByProp(this.items, this.currentSortProp));
  }
} 
