import router from '../router';
import { renderItem, renderRelatedItems } from '../helpers/render';
import { getPersonById } from '../services/api';

export default class Detail {
  constructor(id) {
    this.wrapper = document.getElementById('root-view');

    this.init(id);
  }

  mapListItems = ({ height, mass, birthYear, planet }) => ({
    'Height': height || 'unkown',
    'Mass': mass || 'unkown',
    'Birth Year': birthYear && birthYear !== 'unkown' ? `${birthYear}BBY` :  'unkown',
    'Planet': planet || 'unkown'
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
    let item = renderItem(person.name, details);
    item = this.renderOtherResidents(item, person.residents);
    fragment.appendChild(item);

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
    this.showLoading();
    this.addNavigateListener();

    this.person = await getPersonById(id);
    this.renderPerson();
  }
} 
