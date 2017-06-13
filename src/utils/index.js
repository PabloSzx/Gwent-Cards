import _ from 'lodash';
import levenshtein from 'fast-levenshtein';

function stringToPathKey(input) {
  let string = input;
  string = string.replace(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./@#\\]/g, '');
  string = string.replace(/\s/g, '-');
  string = string.toLocaleLowerCase();
  return encodeURIComponent(string);
}

function checkChineseOrJapaneseCharacter(input) {
  if (input.match(/[\u3400-\u9FBF]/)) {
    return true;
  }

  return false;
}

function checkRussianCharacter(input) {
  const cyrillicPattern = /[\u0400-\u04FF]/;
  return cyrillicPattern.test(input);
}

function colorFaction(faction) {
  let fact = 'Neutral';
  fact = faction.indexOf('Monsters') !== -1 ? 'Monsters' : fact;
  fact = faction.indexOf('Nilfgaard') !== -1 ? 'Nilfgaard' : fact;
  fact = faction.indexOf('Northern') !== -1 ? 'Northern Realms' : fact;
  fact = faction.indexOf('Scoia') !== -1 ? "Scoia'tael" : fact;
  fact = faction.indexOf('Skellige') !== -1 ? 'Skellige' : fact;

  switch (fact) {
    case 'Neutral':
      {
        return 0x7F6000;
      }
    case 'Monsters':
      {
        return 0x720000;
      }
    case 'Nilfgaard':
      {
        return 0x000000;
      }
    case 'Northern Realms':
      {
        return 0x3D85C6;
      }
    case "Scoia'tael":
      {
        return 0x6AA84F;
      }
    default: // Skellige
      {
        return 0x674EA7;
      }
  }
}

function ignoreSpelling(input) {
  return input
  .replace(/á/g, 'a')
  .replace(/é/g, 'e')
  .replace(/í/g, 'i')
  .replace(/ó/g, 'o')
  .replace(/ú/g, 'u')
  .replace(/'/g, '')
  .replace(/:/g, '')
  .replace(/ï/g, 'i')
  .replace(/–/g, '-')
  .toLowerCase();
}

function filter(array, input) {
  return _.filter(array, (value) => {
    if (ignoreSpelling(value).indexOf(ignoreSpelling(input)) !== -1) {
      return value;
    }
  });
}

function nicknameCheck(input, object) {
  let nickname;
  _.map(object, (value, key) => {
    _.map(value, (v, k) => {
      if (k > 0) {
        if (v.toLowerCase() === input.toLowerCase()) {
          nickname = key;
        }
      }
    });
  });

  return nickname;
}

function bestPossibility(array, input) {
  let best = array[0];
  let bestDif = levenshtein.get(input, best);
  let dif = 0;
  _.map(array, (value) => {
    dif = levenshtein.get(input, value);
    if (dif < bestDif) {
      best = value;
      bestDif = dif;
    }
  });

  return best;
}

function getImage(data) {
  const variation = Object.keys(data.variations)[0];
  return `https://cdn.zolmeister.com/gwent/images/cards/${variation}_low.png`;
}


function checkChannelPermission(channel, list) {
  let bool = true;

  _.map(list, (value) => {
    if (channel === value) {
      bool = false;
    }
  });

  return bool;
}


export { stringToPathKey, checkChineseOrJapaneseCharacter,
  checkRussianCharacter, colorFaction, ignoreSpelling, filter,
  nicknameCheck, getImage, checkChannelPermission, bestPossibility,
};
