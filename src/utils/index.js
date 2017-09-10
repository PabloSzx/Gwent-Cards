import _ from 'lodash';
import levenshtein from 'fast-levenshtein';
import { equivalents } from '../data';

String.prototype.replaceLast = function(what, replacement) {
  return this.split(' ')
    .reverse()
    .join(' ')
    .replace(new RegExp(what), replacement)
    .split(' ')
    .reverse()
    .join(' ');
};

String.prototype.paddingLeft = function(paddingValue, length) {
  return String(paddingValue.repeat(length) + this).slice(-length);
};

String.prototype.paddingRight = function(paddingValue, length) {
  return String(this + paddingValue.repeat(length)).slice(0, length);
};

function stringToPathKey(input) {
  if (input) {
    let str = input;
    str = str.replace(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./@#\\]/g, '');
    str = str.replace(/\s/g, '-');
    str = str.toLocaleLowerCase();
    return encodeURIComponent(str);
  }
  return '';
}

function getEquivalent(input) {
  let equivalent;

  const pathKey = stringToPathKey(input);

  _.find(equivalents, (value, key) =>
    _.find(value, val => {
      if (val) {
        if (pathKey == val) {
          equivalent = key;
          return key;
        }
      }
    })
  );

  return equivalent;
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
  fact = faction.indexOf('Monster') !== -1 ? 'Monsters' : fact;
  fact = faction.indexOf('Nilfgaard') !== -1 ? 'Nilfgaard' : fact;
  fact = faction.indexOf('Northern') !== -1 ? 'Northern Realms' : fact;
  fact = faction.indexOf('Scoia') !== -1 ? "Scoia'tael" : fact;
  fact = faction.indexOf('Skellige') !== -1 ? 'Skellige' : fact;

  switch (fact) {
    case 'Neutral': {
      return 0x7f6000;
    }
    case 'Monsters': {
      return 0x720000;
    }
    case 'Nilfgaard': {
      return 0x1a1a1a;
    }
    case 'Northern Realms': {
      return 0x3d85c6;
    }
    case "Scoia'tael": {
      return 0x6aa84f;
    }
    default: // Skellige
    {
      return 0x674ea7;
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
  return _.filter(array, value => {
    if (ignoreSpelling(value).indexOf(ignoreSpelling(input)) !== -1) {
      return value;
    }
  });
}

function nicknameCheck(input, list) {
  let nickname;
  let lng = 'en-US';
  _.find(list, (value, key) => {
    // value = object / key = aelirenn, etc..
    return _.find(value, (v, k) => {
      // v = zap, dbomb, etc... / k = name, nick1, nick2, etc...
      if (k !== 'name') {
        if (v.toLowerCase() === input.toLowerCase()) {
          nickname = key;
          if (k === 'nick5' || k === 'nick6') {
            lng = 'ru-RU';
          }
          return key;
        }
      }
    });
  });

  return [nickname, lng];
}

function bestPossibility(array, input) {
  let best = array[0];
  let bestDif = levenshtein.get(input, best);
  let dif = 0;
  _.forIn(array, value => {
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

  _.forIn(list, value => {
    if (channel === value) {
      bool = false;
      return false;
    }
  });

  return bool;
}

function secondsTransition(msg, txt, seconds) {
  const txt_edit = txt.replaceLast(/(10|8|6|4|2)/, x => x - 2);
  _.delay(() => {
    msg
      .edit('<@' + msg.mentions.users.firstKey() + '>, ' + txt_edit)
      .then(m => secondsTransition(m, txt_edit, seconds))
      .catch(err => {
        const x = err;
        //recursion end
      });
  }, seconds);
}

export {
  stringToPathKey,
  checkChineseOrJapaneseCharacter,
  checkRussianCharacter,
  colorFaction,
  ignoreSpelling,
  filter,
  nicknameCheck,
  getImage,
  checkChannelPermission,
  bestPossibility,
  getEquivalent,
  secondsTransition,
};
