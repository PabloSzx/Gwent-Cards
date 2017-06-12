import { Discord } from './src/components';

const token = process.env.token;
const apiKey = process.env.firebasetoken;
const databaseURL = process.env.databaseurl;

const bot = new Discord(token, apiKey, databaseURL);
bot.start();
