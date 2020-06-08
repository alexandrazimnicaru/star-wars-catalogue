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
  
  return {
    id: parseId(apiResponse.url),
    name: apiResponse.name || '',
    height: apiResponse.height || '',
    mass: apiResponse.mass || '',
    birthYear: apiResponse.birth_year || ''
  };
};

export const parsePersonForDetail = (apiResponse, planet) => ({
  ...parsePerson(apiResponse),
  ...planet
});
