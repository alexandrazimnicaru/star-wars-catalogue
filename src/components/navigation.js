import router from '../router';
import { renderBtnList } from '../helpers/render';
import { subscribe } from '../services/observer';
import { RESET_PAGES, DESTROY_CURRENT_VIEW, RESULTS_PER_PAGE, VIEWS } from '../constants';

export default class Navigation {
  constructor(count, current) {
    this.wrapper = document.getElementById('root-navigation');
    this.total = (!count || isNaN(count)) ? 0 : Math.ceil(count / RESULTS_PER_PAGE);
    this.current = this.getCurrent(current);
    this.resetPagesSubs = null;
    this.destroySubs = null;
  }

  getCurrent = (current) => {
    const parsed = parseInt(current, 10);

    if (!parsed || isNaN(parsed)) {
      return 1;
    }

    if (current > this.total) {
      return this.total;
    }

    return parsed;
  }

  getPageLinks = () => {
    const links = [];

    if (this.current > 1) {
      links.push({ attrs: { page: this.current - 1 }, title: '<' });
    }

    links.push({ attrs: { page: this.current }, title: `Page ${this.current} of ${this.total}` });

    if (this.current < this.total) {
      links.push({ attrs: { page: this.current + 1 }, title: '>' });
    }

    return links;
  }

  renderPageLinks = () => {
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(renderBtnList(document.createElement('section'), this.getPageLinks()));
  }

  renderOnReset = (count) => {
    this.total = (!count || isNaN(count)) ? 0 : Math.ceil(count / RESULTS_PER_PAGE);
    this.current = 1;
    this.renderPageLinks();
  }

  navigateToPage = (e) => {
    if (e.target.matches('button')) {
      const page = e.target.getAttribute('data-page');
      if (!page) {
        return;
      }

      router.navigate(`?page=${page}`);
    }
  }

  addNavigateListener = () => {
    this.wrapper.addEventListener('click', this.navigateToPage);
  }

  removeNavigateListener = () => {
    this.wrapper.removeEventListener('click', this.navigateToPage);
  }

  destroy = (prevView) => {
    if (prevView === VIEWS.OVERVIEW) {
      this.wrapper.innerHTML = '';
    }
    this.removeNavigateListener();
    this.resetPagesSubs.unsubscribe();
    this.destroySubs.unsubscribe();
  }

  init = () => {
    // re-render pages on search
    this.resetPagesSubs = subscribe(RESET_PAGES,  this.renderOnReset);
    this.destroySubs = subscribe(DESTROY_CURRENT_VIEW, this.destroy);

    this.renderPageLinks();
    this.addNavigateListener();
  }
} 
