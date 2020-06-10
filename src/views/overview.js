import Catalogue from '../components/catalogue';
import Navigation from '../components/navigation';
import { getPeopleWithCount, searchPeopleWithCount } from '../services/api';

export default class Overview {
  constructor() {
    this.renderWasCancelled = false;

    this.init();
  }

  getQueryParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      page: urlParams.get('page') || '1',
      searchKeyWord: urlParams.get('search') || ''
    };
  }

  getPeople = (searchKeyWord, page) => {
    if (searchKeyWord) {
      return searchPeopleWithCount(searchKeyWord, page);
    }

    return getPeopleWithCount(page);
  }

  destroy = () => {
    this.catalogue.destroy();
    this.navigation.destroy();
    // avoid render after req finished on slow networks
    this.renderWasCancelled = true;
  }

  init = async () => {
    const { page, searchKeyWord } = this.getQueryParams();
    const { people, count } = await this.getPeople(searchKeyWord, page);
    if (!people) {
      return;
    }

    this.catalogue = new Catalogue(people);
    this.navigation = new Navigation(count, page, searchKeyWord);
  }
} 
