import router from '../router';
import { renderBtnList } from '../helpers/render';
import { RESULTS_PER_PAGE } from '../constants';

export default class Navigation {
  constructor(count, current, searchKeyWord = '') {
    this.wrapper = document.getElementById('root-navigation');
    this.total = (!count || isNaN(count)) ? 0 : Math.ceil(count / RESULTS_PER_PAGE);
    this.current = this.calculateCurrentPage(current);
    this.searchKeyWord = searchKeyWord;

    this.init();
  }

  getCurrentPage = () => this.current;

  calculateCurrentPage = (current) => {
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

  navigateToPage = (e) => {
    if (e.target.matches('button')) {
      const page = e.target.getAttribute('data-page');
      if (!page) {
        return;
      }

      if (this.searchKeyWord) {
        router.navigate(`?search=${this.searchKeyWord}&page=${page}`);
      } else {
        router.navigate(`?page=${page}`);
      }
    }
  }

  addNavigateListener = () => {
    this.wrapper.addEventListener('click', this.navigateToPage);
  }

  removeNavigateListener = () => {
    this.wrapper.removeEventListener('click', this.navigateToPage);
  }

  destroy = () => {
    this.wrapper.innerHTML = '';
    this.removeNavigateListener();
  }

  init = () => {
    this.renderPageLinks();
    this.addNavigateListener();
  }
} 
