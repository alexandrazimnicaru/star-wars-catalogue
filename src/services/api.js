import 'whatwg-fetch';
import { parsePerson, parsePersonForDetail, parseResident, parseUrl } from '../helpers/parser';
import { publish } from './observer';
import { SHOW_ERROR } from '../constants';

const BASE_URL = 'https://swapi.dev/api';
const GET_PEOPLE_ERROR = 'An error occured while looking for you favourite Star Wars characters, please try again or contact us';
const GET_RESIDENTS_ERROR = 'An error occured while looking for Star Wars characters on the same planet, please try again or contact us';
const GET_PLANET_ERROR = 'An error occured while looking your character\'s planet information, please try again or contact us';
const GET_PERSON_ERROR = 'An error occured while looking for your character, please try again or contact us';

export const getPeople = async (searchTerm = '', page = 1) => {
  let people = [];

  try {
    let url = `${BASE_URL}/people/?search=${searchTerm}&page=${page}`;
    while (url) {
      const response = await fetch(url);
      const jsonResponse = await response.json();

      if (!jsonResponse) {
        url = null;
        continue;
      }
  
      const { results, next } = jsonResponse;
      if (results && results.length) {
        people = people.concat(results.map(person => parsePerson(person)));
      }

      url = next && parseUrl(next);
    }
  } catch(err) {
    publish(SHOW_ERROR, GET_PEOPLE_ERROR);
    return [];
  }
  return people;
};

export const getPlanetResidents = async (urls, currentPersonUrl) => {
  if (!urls || !urls.length) {
    return [];
  }

  const residents = [];
  try {
    for (const url of urls) {
      const parsedUrl = parseUrl(url);
      if (parsedUrl === currentPersonUrl) {
        continue;
      }
  
      const response = await fetch(parsedUrl);
      const jsonResponse = await response.json();
      if (!jsonResponse) {
        return [];
      }

      residents.push(parseResident(jsonResponse));
    }
  } catch(err) {
    publish(SHOW_ERROR, GET_RESIDENTS_ERROR);
    return [];
  }
  return residents;
};

const getPlanetForPerson = async ({ homeworld, url }) => {
  if (!homeworld) {
    return null;
  }

  const planetUrl = parseUrl(homeworld);
  try {
    const response = await fetch(planetUrl);
    const jsonResponse = await response.json();
    if (!jsonResponse) {
      return null;
    }

    const residents = await getPlanetResidents(jsonResponse.residents, parseUrl(url));
    return { planet: jsonResponse.name || '', residents };
  } catch(err) {
    publish(SHOW_ERROR, GET_PLANET_ERROR);
    return null;
  }
};

export const getPersonById = async (id) => {
  if (!id) {
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/people/${id}/`);
    const jsonResponse = await response.json();
    if (!jsonResponse) {
      return null;
    }

    const planet = await getPlanetForPerson(jsonResponse);
    
    return parsePersonForDetail(jsonResponse, planet);
  } catch(err) {
    publish(SHOW_ERROR, GET_PERSON_ERROR);
    return null;
  }
};
