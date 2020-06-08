let banner = document.getElementById('root-banner');
let bannerText = document.getElementById('banner-error');

export const addError = (errorText) => {
  const text = document.createTextNode(errorText || 'An error occured, please try again or contact us');
  bannerText.innerHTML = '';
  bannerText.appendChild(text);
  
  banner.classList.remove('is-hidden');
};

export const removeError = () => {
  banner.classList.add('is-hidden');
};

export const initializeErrorHandling = () => {
  const closeBtn = document.getElementById('close-banner-btn');
  closeBtn.addEventListener('click', removeError);
};