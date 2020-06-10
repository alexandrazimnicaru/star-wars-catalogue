export default class Loader {
  constructor() {
    this.wrapper = document.getElementById('root-view');
  }

  showLoading = () => {
    this.wrapper.innerHTML = 'Loading...';
  }
}
