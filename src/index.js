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
import { SORT_PROP } from './constants';

initializeErrorHandling();

const search = new Search();
const sort = new Sort(SORT_PROP);
let overview;
let detail;
router
  .on('detail/:id', function (params) {
    // remove pre-existing errors
    removeError();

    detail = new Detail(params.id);
  }, {
    leave: function () {
      detail.destroy();
    }
  }) 
  .on('', function () {
    // since the sort/search wrappers are not dynamic it's more efficient
    // to show/hide them than re-create / re-attach listeners / re-attach subscriptions
    search.show();
    sort.show();

    // remove pre-existing errors
    removeError();

    overview = new Overview();
  }, {
    leave: function () {
      overview.destroy();

      search.hide();
      sort.hide();
    }
  })
  .resolve();
