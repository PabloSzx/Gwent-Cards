import { Discord } from './src/components';

let token;
let apiKey;
let databaseURL;

try {
	token = require('./test/keys.js').token;
	apiKey = require('./test/keys.js').apiKey;
	databaseURL = require('./test/keys.js').databaseURL;
} catch (err) {
	token = process.env.token;
	apiKey = process.env.firebasetoken;
	databaseURL = process.env.databaseurl;
}

const bot = new Discord(token, apiKey, databaseURL);
bot.start();
