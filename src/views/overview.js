import Catalogue from '../components/catalogue';
import Navigation from '../components/navigation';
import { getPeopleWithCount } from '../services/api';

export default class Overview {
  constructor() {
    this.init();
  }

  getQueryParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      page: urlParams.get('page') || '1',
      searchKeyWord: urlParams.get('search') || ''
    };
  }

  destroy = () => {
    this.catalogue.destroy();
    this.navigation.destroy();
  }

  init = async () => {
    const { page, searchKeyWord } = this.getQueryParams();
    const { people, count } = await getPeopleWithCount(searchKeyWord, page);
    if (!people) {
      return;
    }

    this.catalogue = new Catalogue(people);
    this.navigation = new Navigation(count, page, searchKeyWord);
  }
} 
