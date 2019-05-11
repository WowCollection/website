
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
/* react-intl import */
import { IntlProvider } from 'react-intl';
import messages_fr from "./translation/fr.json"
import messages_en from "./translation/en.json"
// Redux import
import Provider from "react-redux/es/components/Provider";
import { store } from "./store/configureStore";

const messages = {
    'en': messages_en,
    'fr': messages_fr
}

var locale = window.navigator.language;
var firstLocale = locale.split('-');

const language = firstLocale[0];

// Add new method to localstorage
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}

// Add new method to localstorage
Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}

ReactDOM.render(
<IntlProvider locale={language} messages={messages[language]}>
  <Provider store={store}>
    <App />
  </Provider>
</IntlProvider>,
document.getElementById('root')
);

serviceWorker.register();
