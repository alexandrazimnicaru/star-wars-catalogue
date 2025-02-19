import Navigo from 'navigo';
import { subscribe } from './services/observer';
import { RESET_PAGES } from './constants';

const router = new Navigo('/');

// subscribe to searches
const navigateOnSearch = (searchKeyWord) => {
  if (!searchKeyWord) {
    router.navigate('');
    return;
  }

  router.navigate(`?search=${searchKeyWord}&page=1`);
}
subscribe(RESET_PAGES, navigateOnSearch);

export default router;
