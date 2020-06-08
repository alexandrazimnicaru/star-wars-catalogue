import Catalogue from '../components/catalogue';
import Navigation from '../components/navigation';
import { getPeopleWithCount } from '../services/api';


export default class Overview {
  constructor(router) {
    this.router = router;
  }

  getCurrentPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('page') || '1';
  }

  init = async () => {
    const page = this.getCurrentPage();
    const { people, count } = await getPeopleWithCount(page);
    if (!people || !people.length) {
      return;
    }

    const catalogue = new Catalogue(people, this.router);
    catalogue.init();

    const navigation = new Navigation(count, page);
    navigation.init();
  }
} 
