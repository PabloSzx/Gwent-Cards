
// const token = process.env.token;
const Discord = require('discord.js');
const axios = require('axios');
const levenshtein = require('fast-levenshtein');
const _ = require('lodash');
const fs = require('fs');
const firebase = require('firebase');
const getValues = require('object.values');
const Cards = require('./cards.json');
const Nicknames = require('./nicknames.json');
const translation = require('./translation');