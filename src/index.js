/* @babel/preset-env needs regeneratorRuntime available globally for transpiling async/await in older browsers */
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
/* eslint-enable no-unused-vars */
import router from './router';
import Overview from './views/overview';
import Detail from './views/detail';
import Search from './components/search';
import Sort from './components/sort';
import ErrorHandler from './components/error-handler';

const errorHandler = new ErrorHandler();
const search = new Search();
const sort = new Sort();
let overview;
let detail;
router
  .on('detail/:id', function (params) {
    detail = new Detail(params.id);
  }, {
    leave: function () {
      detail.destroy();
  
      errorHandler.removeError(); // remove existing errors
    }
  }) 
  .on('', function () {
    // since the sort/search wrappers are not dynamic it's more efficient
    // to show/hide them than re-create / re-attach listeners / re-attach subscriptions
    search.show();
    sort.show();

    overview = new Overview();
  }, {
    leave: function () {
      overview.destroy();

      errorHandler.removeError(); // remove existing errors

      search.hide();
      sort.hide();
    }
  })
  .resolve();
