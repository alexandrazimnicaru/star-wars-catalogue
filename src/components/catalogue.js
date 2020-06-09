import router from '../router';
import { renderItemWithReadMore } from '../helpers/render';
import { subscribe, publish } from '../services/observer';
import { RENDER_ITEMS, SYNC_ITEMS, DESTROY_PREV_VIEW } from '../constants';

export default class Catalogue {
  constructor(people) {
    this.people = people;
    this.wrapper = document.getElementById('root-view');
    this.renderSubs = null;
    this.destroySubs = null;
  }

  mapListItems = ({ height, mass, birthYear }) => ({
    'Height': height || 'n/a',
    'Mass': mass || 'n/a',
    'Birth Year': birthYear || 'n/a'
  })

  renderPeople = (updatedPeople = this.people) => {
    const people = updatedPeople || this.people;
    const fragment = document.createDocumentFragment();

    const ul = document.createElement('ul');
    ul.classList.add('grid');
    people.forEach((person) => {
      const details = this.mapListItems(person);
      const item = renderItemWithReadMore(person.name, details, { detail: person.id }, 'button--raised');
      ul.appendChild(item);
    });
    fragment.appendChild(ul);

    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(fragment);
  }

  navigateToDetail = (e) => {
    if (e.target.matches('button')) {
      const id = e.target.getAttribute('data-detail');
      if (!id) {
        return;
      }

      router.navigate(`detail/${id}`);
    }
  }

  addNavigateListener = () => {
    this.wrapper.addEventListener('click', this.navigateToDetail);
  }

  removeNavigateListener = () => {
    this.wrapper.removeEventListener('click', this.navigateToDetail);
  }

  showLoading = () => {
    this.wrapper.innerHTML = 'Loading...';
  }

  destroy = () => {
    this.removeNavigateListener();
    this.renderSubs.unsubscribe();
    this.destroySubs.unsubscribe();
  }

  init = () => {
    // re-render items on updates
    this.renderSubs = subscribe(RENDER_ITEMS, this.renderPeople);
    this.destroySubs = subscribe(DESTROY_PREV_VIEW, this.destroy);

    this.showLoading();
    this.addNavigateListener();

    // sync items with other modules
    publish(SYNC_ITEMS, this.people);
  }
} 
