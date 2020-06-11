import router from '../router'; 
import { getPeople } from '../services/api';
import { subscribe, publish } from '../services/observer';
import { renderItemWithReadMore, renderNoResults } from '../helpers/render';
import { RENDER_ITEMS, SYNC_ITEMS } from '../constants';
 
export default class Overview {
  constructor() {
    this.renderWasCancelled = false;
    this.wrapper = document.getElementById('root-view');

    this.init();
  }

  getQueryParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('search') || '';
  }

  mapListItems = ({ height, mass, birthYear }) => ({
    'Height': height || 'unkown',
    'Mass': mass || 'unkown',
    'Birth Year': birthYear ? `${birthYear}BBY` :  'unkown'
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
    // avoid render after req finished on slow networks
    this.renderWasCancelled = true;
  }

  init = async () => {
    // re-render items on updates
    this.renderSubs = subscribe(RENDER_ITEMS, this.renderPeople);

    this.addNavigateListener();
  
    this.people = await getPeople(this.getQueryParams());
    if (!this.people || this.renderWasCancelled) {
      return;
    }

    // sync items with other modules
    publish(SYNC_ITEMS, this.people);
  }
} 
