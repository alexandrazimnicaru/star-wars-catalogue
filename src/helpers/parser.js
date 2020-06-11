const parseId = (url) => {
  if (!url) {
    return '';
  }

  // the id is the last url param, between the last 2 slashes
  const urlParams = url.split('/');
  return urlParams[urlParams.length - 2];
};

export const parseResident = (apiResponse) => ({
  id: parseId(apiResponse.url),
  name: apiResponse.name || ''
});

export const parsePerson = (apiResponse) => {
  if (!apiResponse) {
    return null;
  }

  const height = parseInt(apiResponse.height, 10);
  const mass = parseInt(apiResponse.mass, 10);
  const birthYear = parseFloat(apiResponse.birth_year);
  
  return {
    id: parseId(apiResponse.url),
    name: apiResponse.name || '',
    height: isNaN(height) ? 0 : height,
    mass: isNaN(mass) ? 0 : mass,
    birthYear: isNaN(birthYear) ? 0 : birthYear
  };
};

export const parsePersonForDetail = (apiResponse, planet) => ({
  ...parsePerson(apiResponse),
  ...planet
});

// the api returns the next urls with http
// but we get a CORS error in Safari with http, so re-write to https
export const parseUrl = (url) => (
  url && url.match('^http://') ? url.replace(/^http:\/\//i, 'https://') : url
);
