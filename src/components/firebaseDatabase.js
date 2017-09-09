import _ from 'lodash';
import firebase from 'firebase';
import { secondsTransition } from '../utils';
import { self_destruct } from '../data';

export default class FirebaseDatabase {
  constructor(apiKey, databaseURL) {
    this.database = firebase.initializeApp({
      apiKey,
      databaseURL,
    });

    this.channels = {};

    this.database.database().ref().on('value', snapshot => {
      this.channels = snapshot.val();
    });
  }

  addServer(id, language, message) {
    const languageToAdd =
      language.substring(0, language.indexOf('-')).toLowerCase() +
      language.substring(language.indexOf('-')).toUpperCase();
    let pass;
    switch (languageToAdd) {
      case 'de-DE':
      case 'en-US':
      case 'es-ES':
      case 'es-MX':
      case 'fr-FR':
      case 'it-IT':
      case 'ja-JP':
      case 'pl-PL':
      case 'pt-BR':
      case 'ru-RU':
      case 'zh-CN':
      case 'zh-TW': {
        pass = true;
        break;
      }
      default:
        pass = false;
    }

    if (pass) {
      this.database
        .database()
        .ref()
        .update({ [id]: languageToAdd })
        .then(() => {
          console.log('--Language Updated--');
          // const msg = ` \n\n\n\`This message will self-destruct in ten seconds\``;
          // message
          //   .reply(msg)
          //   .then(m => m.delete(10000))
          //   .catch(err => console.error(err));
          let txt = `Your server default language has updated to: ${languageToAdd} ${self_destruct}`;
          message
            .reply(txt)
            .then(m => {
              m.delete(10000);
              secondsTransition(m, txt, 1800);
            })
            .catch(err => console.error(err));
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      let txt = `Error, ${language} not recognized ${self_destruct}`;
      message
        .reply(txt)
        .then(m => {
          m.delete(10000);
          secondsTransition(m, txt, 1800);
        })
        .catch(err => console.error(err));

      // message
      //   .reply(
      //      \n\n\n\`This message will self-destruct in ten seconds\``
      //   )
      //   .then(m => m.delete(10000).catch(err => console.error(err)));
    }
  }

  checkLanguageOnServer(poss, guildId) {
    const defaultServer = 'en-US';
    let server;

    _.map(this.channels, (value, key) => {
      if (key === guildId) {
        server = value;
      }
    });

    let n;
    let priority = -1;
    let defaultPriority = -1;

    _.map(poss, (value, key) => {
      n = Object.keys(value)[0];
      if (n === server) {
        priority = key;
      } else if (n === defaultServer) {
        defaultPriority = key;
      }
    });

    return priority !== -1 ? priority : defaultPriority;
  }
}
