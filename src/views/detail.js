import router from '../router';
import { renderItem, renderRelatedItems } from '../helpers/render';
import { getPersonById } from '../services/api';
import { subscribe } from '../services/observer';
import { DESTROY_PREV_VIEW } from '../constants';

export default class Detail {
  constructor() {
    this.person = null;
    this.wrapper = document.getElementById('root-overview');
    this.destroySubs = null;
  }

  mapListItems = ({ height, mass, birthYear, planet }) => ({
    'Height': height || 'n/a',
    'Mass': mass || 'n/a',
    'Birth Year': birthYear || 'n/a',
    'Planet': planet || 'n/a'
  })

  renderOtherResidents = (fragment, residents) => {
    if (!residents || !residents.length) {
      return fragment;
    }
 
    const btns = residents.map(resident => ({ attrs: { detail: resident.id }, title: resident.name }));
    fragment.appendChild(renderRelatedItems('Other planet residents', btns));
    return fragment;
  }

  renderPerson = (person = this.person) => {
    if (!this.person) {
      return;
    }

    let fragment = document.createDocumentFragment();
    const details = this.mapListItems(person);
    const item = renderItem(person.name, details);
    fragment.appendChild(item);
    fragment = this.renderOtherResidents(fragment, person.residents);

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
  }

  async init(id) {
    this.destroySubs = subscribe(DESTROY_PREV_VIEW, this.destroy);
    this.showLoading();

    this.person = await getPersonById(id);
    this.renderPerson();
  }
} 
