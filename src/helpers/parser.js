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
    height: apiResponse.height ? parseInt(apiResponse.height, 10) : null,
    mass: apiResponse.mass ? parseInt(apiResponse.mass, 10) : null,
    birthYear: apiResponse.birth_year && apiResponse.birth_year !== 'unkown' ? parseFloat(apiResponse.birth_year) : 'unkown'
  };
};

export const parsePersonForDetail = (apiResponse, planet) => ({
  ...parsePerson(apiResponse),
  ...planet
});
