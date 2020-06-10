import router from '../router';
import { renderItemWithReadMore, renderNoResults } from '../helpers/render';
import { subscribe, publish } from '../services/observer';
import { RENDER_ITEMS, SYNC_ITEMS } from '../constants';

export default class Catalogue {
  constructor(people) {
    this.people = people || [];
    this.wrapper = document.getElementById('root-view');

    this.init();
  }

  mapListItems = ({ height, mass, birthYear }) => ({
    'Height': height || 'unkown',
    'Mass': mass || 'unkown',
    'Birth Year': birthYear && birthYear !== 'unkown' ? `${birthYear}BBY` :  'unkown'
  })

  renderPeople = (updatedPeople = this.people) => {
    const people = updatedPeople || this.people;
    if (!people) {
      return;
    }

    const fragment = document.createDocumentFragment();

    if (!people.length) {
      fragment.appendChild(renderNoResults());
    } else {
      const ul = document.createElement('ul');
      ul.classList.add('grid');
      people.forEach((person) => {
        const details = this.mapListItems(person);
        const item = renderItemWithReadMore(person.name, details, { detail: person.id }, 'button--raised');
        ul.appendChild(item);
      });
      fragment.appendChild(ul);
    }

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

  destroy = () => {
    this.removeNavigateListener();
    this.renderSubs.unsubscribe();
    this.people = null;
  }

  init = () => {
    // re-render items on updates
    this.renderSubs = subscribe(RENDER_ITEMS, this.renderPeople);

    this.addNavigateListener();

    // sync items with other modules
    publish(SYNC_ITEMS, this.people);
  }
} 
