import { userService } from './UserService';

export default class RequestService {
  // Initializing important variables
  constructor(domain) {
    this.fetch = this.fetch.bind(this) // React binding stuff

    this.domain = document.domain;
    this.prodApiDomain = 'https://api.tavernofcho.com';
    this.devApiDomain = 'https://127.0.0.1:8052';
    this.domainForRequest = '';

    switch(this.domain) {
      case '127.0.0.1':
        console.log("dev");
        this.domainForRequest = this.devApiDomain;
        break;
      case 'tavernofcho.com':
        console.log('prod');
        this.domainForRequest = this.prodApiDomain;
        break;
      default:
        this.domainForRequest = null;
    }

  }

  getServers = () => {
    return this.fetch(`${this.domainForRequest}/realms`, {
      method: 'GET'
    }).then(res => {
      return Promise.resolve(res);
    })
  }

  getMounts = () => {
    return this.fetch(`${this.domainForRequest}/characters/aikisugi/Dalaran/mounts`, {
      method: 'GET'
    }).then(res => {
      console.log('In service res:',res);
      return Promise.resolve(res);
    })
  }

  getCharacter(character) {
    return this.fetch(`${this.domainForRequest}/characters/` + character + '?realm=dalaran', {
      method: 'GET'
    }).then(res => {
      return Promise.resolve(res);
    })
  }


  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (userService.loggedIn()) {
      headers['Authorization'] = 'Bearer ' + userService.getToken()
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json())
  }

  _checkStatus(response) {
    console.log('resp status',response.status);

    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }
}
