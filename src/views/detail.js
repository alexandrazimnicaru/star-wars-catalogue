import router from '../router';
import { renderRelatedItems, renderItem } from '../helpers/render';
import { getPersonById } from '../services/api';

export default class Detail {
  constructor(id) {
    this.wrapper = document.getElementById('root-view');
    this.renderWasCancelled = false;

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

  renderPerson = () => {
    if (!this.person || this.renderWasCancelled) {
      return;
    }

    const details = this.mapListItems(this.person);

    let fragment = document.createDocumentFragment();
    let item = renderItem(this.person.name, details);
    item = this.renderOtherResidents(item, this.person.residents);
    fragment.appendChild(item);

    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(fragment);
  }

  goBack = (e) => {
    if (e.target.matches('button')) {
      const hasBackAttr = e.target.getAttribute('data-back');
      if (!hasBackAttr) {
        return;
      }

      router.off(router.lastRouteResolved())
    }
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
    this.wrapper.addEventListener('click', this.goBack);
  }

  removeNavigateListener = () => {
    this.wrapper.removeEventListener('click', this.navigateToDetail);
    this.wrapper.removeEventListener('click', this.goBack);
  }

  showLoading = () => {
    this.wrapper.innerHTML = 'Loading...';
  }

  destroy = () => {
    this.removeNavigateListener();
    // avoid render after req finished on slow networks
    this.renderWasCancelled = true;
  }

  async init(id) {
    this.showLoading();
    this.addNavigateListener();

    this.person = await getPersonById(id);
    this.renderPerson();
  }
} 
