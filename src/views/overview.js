import Catalogue from '../components/catalogue';
import Navigation from '../components/navigation';
import { getPeopleWithCount } from '../services/api';

export default class Overview {
  constructor() {
    this.init();
  }

  getCurrentPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('page') || '1';
  }

  destroy = () => {
    this.catalogue.destroy();
    this.navigation.destroy();
  }

  init = async () => {
    const page = this.getCurrentPage();
    const { people, count } = await getPeopleWithCount(page);
    if (!people || !people.length) {
      return;
    }

    this.navigation = new Navigation(count, page);
    this.catalogue = new Catalogue(people);
  }
} 
