/* @babel/preset-env needs regeneratorRuntime available globally for transpiling async/await in older browsers */
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
/* eslint-enable no-unused-vars */
import router from './router';
import Overview from './views/overview';
import Detail from './views/detail';
import Search from './components/search';
import Sort from './components/sort';
import { initializeErrorHandling, removeError } from './services/error-handling';
import { publish } from './services/observer';
import { SORT_PROP, DESTROY_PREV_VIEW, VIEWS } from './constants';

// since the sort/search wrappers are not dynamic it's more efficient
// to show/hide them than re-create / re-attach listeners / re-attach subscriptions
const search = new Search();
search.init();

const sort = new Sort(SORT_PROP);
sort.init();

initializeErrorHandling();

router
  .on('detail/:id', function (params) {
    // remove pre-existing errors
    removeError();

    const detail = new Detail();
    detail.init(params.id);
  }, {
    after: function () {
      publish(DESTROY_PREV_VIEW, VIEWS.DETAIL);
    }
  }) 
  .on('', function () {
    // remove pre-existing errors
    removeError();

    const overview = new Overview();
    overview.init();
  }, {
    after: function () {
      publish(DESTROY_PREV_VIEW, VIEWS.OVERVIEW);
    }
  })
  .resolve();
