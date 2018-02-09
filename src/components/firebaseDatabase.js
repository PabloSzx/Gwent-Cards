import _ from 'lodash';
import firebase from 'firebase';
import { secondsTransition } from '../utils';
import { self_destruct } from '../data';

export default class FirebaseDatabase {
	constructor(apiKey, databaseURL) {
		this.database = firebase.initializeApp({
			apiKey,
			databaseURL
		});

		this.channels = {};

		this.database.database().ref().on('value', (snapshot) => {
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
					let txt = `Your server default language has updated to: ${languageToAdd} ${self_destruct}`;
					message
						.reply(txt)
						.then((m) => {
							m.delete(10000);
							secondsTransition(m, txt, 1800);
						})
						.catch(
							(err) =>
								err.message
									? console.error(`Error!, ${err.message} called in firebaseDatabase.js, line 68`)
									: console.error('Error in firebaseDatabase line 68')
						);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			let txt = `Error, ${language} not recognized ${self_destruct}`;
			message
				.reply(txt)
				.then((m) => {
					m.delete(10000);
					secondsTransition(m, txt, 1800);
				})
				.catch(
					(err) =>
						err.message
							? console.error(`Error!, ${err.message} called in firebaseDatabase, line 90`)
							: console.error('Error in firebaseDatabase line 90')
				);
		}
	}

	checkLanguageOnServer(poss, guildId) {
		const defaultServer = 'en-US';
		let server;

		_.forIn(this.channels, (value, key) => {
			if (key === guildId) {
				server = value;
				return false;
			}
		});

		let n;
		let priority = -1;
		let defaultPriority = -1;

		_.forIn(poss, (value, key) => {
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
