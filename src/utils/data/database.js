import _ from 'lodash';
import fs from 'fs';
import raw from './raw.json';
import { stringToPathKey } from '../';

const saveFile = (obj, name) => {
  fs.writeFile(
    './json/' + name + '.json',
    JSON.stringify(obj),
    'utf8',
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log(name + ' was saved!');
    }
  );
};

let cards_language = {
  'de-DE': [],
  'en-US': [],
  'es-ES': [],
  'es-MX': [],
  'fr-FR': [],
  'it-IT': [],
  'ja-JP': [],
  'pl-PL': [],
  'pt-BR': [],
  'ru-RU': [],
  'zh-CN': [],
  'zh-TW': [],
};
_.forEach(raw, (obj, key) => {
  if (obj.released) {
    _.forEach(cards_language, (arreglo, idioma) => {
      arreglo.push(obj.name[idioma]);
    });
  }
});

saveFile(cards_language, 'cards_language');

let database = {};

_.forEach(raw, (obj, key) => {
  if (obj.released) {
    let name = stringToPathKey(obj.name['en-US']);
    database[name] = {
      categories: obj.categories,
      faction: obj.faction,
      info: obj.info,
      name: obj.name,
      loyalties: obj.loyalties,
      positions: obj.positions,
      strength: obj.strength,
      type: obj.type,
      variations: obj.variations,
      rarity: _.sample(obj.variations).rarity,
    };
  }
});

saveFile(database, 'database');

let equivalents = {};

_.forEach(raw, (obj, key) => {
  if (obj.released) {
    let name = stringToPathKey(obj.name['en-US']);
    equivalents[name] = [];
    _.forEach(obj.name, nombre => {
      equivalents[name].push(stringToPathKey(nombre));
    });
  }
});

saveFile(equivalents, 'equivalents');
