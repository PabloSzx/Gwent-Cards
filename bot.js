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

const client = new Discord.Client();

let channels = {};
let botId = 0;

firebase.initializeApp({
  apiKey: process.env.firebasetoken,
  databaseURL: process.env.databaseurl
});

firebase.database().ref().on('value', (snapshot) => {
  channels = snapshot.val();
  console.log(channels);
})

function addServer(id, language, message) {
  let languageToAdd = language.substring(0, language.indexOf("-")).toLowerCase() + language.substring(language.indexOf("-")).toUpperCase();

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
    case 'zh-TW':
    {
      pass = true;
      break;
    }
    default:
    pass = false;
  }

  if (pass) {
    firebase.database().ref().update({ [id]: languageToAdd }).then(() => {
      console.log("--Language Updated--");
      if (message.author.dmChannel) {
        message.author.dmChannel.send("Your server default language has updated to: " + languageToAdd);
      } else {
        message.author.createDM((channel) => {
          channel.send("Your server default language has updated to: " + languageToAdd);
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  } else {
    if (message.author.dmChannel) {
      message.author.dmChannel.send("Error, " + language + " not recognized");
    } else {
      message.author.createDM((channel) => {
        channel.send("Error, " + language + " not recognized");
      });
    }
  }
}

// const token = 'MzE4ODc4NzEyMzgyNzUwNzMx.DB554A.E1Gz2qk7eUzPMu72MYxd5ju6dkw';
const token = process.env.token;
client.login(token);

function stringToPathKey(string) {
  string = string.replace(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/@#\\]/g, '');
  string = string.replace(/\s/g, '-');
  string = string.toLocaleLowerCase();
  return encodeURIComponent(string);
}


client.on('ready', () => {
  console.log('I am ready!');
  botId = client.user.id;
});

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

function categories(data, language) {
  let fields = [];

  fields[fields.length] = `*${translation[language].group}*: **${(translation[language]._group)[data.type]}**`

  let faction = data.faction;
  if (data.faction === 'Northern Realms') {
    faction = 'NorthernKingdom';
  }

  fields[fields.length] = `*${translation[language].faction}*: **${translation[language]._faction[faction]}**`

  let rarity = (getValues(data.variations)[0]).rarity;
  fields[fields.length] = `*${translation[language].rarity}*: **${(translation[language]._rarity)[rarity]}**`

  if (data.strength > 0) {
    fields[fields.length] = `*${translation[language].power}*: **${data.strength.toString()}**`
  }

  let positions = data.positions,
  position;
  if (positions.length === 1) {
    position = positions[0];
  } else if (positions.length === 3){
    position = 'Any';
  }

  fields[fields.length] = `*${translation[language].lane}*: **${(translation[language]._lane)[position]}**`

  if (data.loyalties.length > 0) {
    fields[fields.length] = `*${translation[language].loyalty}*: **${(translation[language]._loyalty)[(data.loyalties)[0]]}**`
  }

  let categories = data.categories,
  category = "";
  if (categories) {
    _.map(categories, (value, key) => {
      category += ((translation[language]._type)[value]);
      if (key < (categories.length - 1)) {
        category += ", ";
      }
    })

    if (data.categories.length > 0) {
      fields[fields.length] = `*${translation[language].type}*: **${category}**`
    }
  }
  return fields;

}

function colorFaction(faction) {
  let fact = "Neutral";
  fact = faction.indexOf("Monsters") !== -1 ? "Monsters" : fact;
  fact = faction.indexOf("Nilfgaard") !== -1 ? "Nilfgaard" : fact;
  fact = faction.indexOf("Northern") !== -1 ? "Northern Realms" : fact;
  fact = faction.indexOf("Scoia") !== -1 ? "Scoia'tael" : fact;
  fact = faction.indexOf("Skellige") !== -1 ? "Skellige" : fact;

  switch (fact) {
    case "Neutral":
    {
      return 0x7F6000;
    }
    case "Monsters":
    {
      return 0x720000;
    }
    case "Nilfgaard":
    {
      return 0x000000;
    }
    case "Northern Realms":
    {
      return 0x3D85C6;
    }
    case "Scoia\'tael":
    {
      return 0x6AA84F;
    }
    default: //Skellige
    {
      return 0x674EA7;
    }
  }
}

function ignoreSpelling(input) {
  return input
  .replace(/á/g, "a").replace(/é/g, "e")
  .replace(/í/g, "i").replace(/ó/g, "o")
  .replace(/ú/g, "u").replace(/'/g, "")
  .replace(/:/g, "").replace(/ï/g, "i")
  .toLowerCase();
}

function filter(array, input) {
  return _.filter(array, (value) => {
    if (ignoreSpelling(value).indexOf(ignoreSpelling(input)) !== -1) {
      return value;
    }
  });;
}

function nicknameCheck(input) {
  let nickname;
  _.map(Nicknames, (value, key) => {
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

function trimCard(param, message) {
  let input = "";

  if (param) {
    input = param.trim();
  }

  if (input.length <= 1) {
    return undefined;
  }

  let poss = {},  length = 0,  values,  keys, priorityIndex,
  nickname = nicknameCheck(input);

  if (nickname) {
    return [ nickname, "en-US" ];
  } else if (checkChineseOrJapaneseCharacter(input)) {
    let jpPossibilities = filter(Cards[6], input);
    let cnPossibilities = filter(Cards[10], input);
    let twPossibilities = filter(Cards[11], input);

    if (jpPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "ja-JP": bestPossibility(jpPossibilities, input) };
    }

    if (cnPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "zh-CN": bestPossibility(cnPossibilities, input) };
    }

    if (twPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "zh-TW": bestPossibility(twPossibilities, input) };
    }

    length = Object.keys(poss).length;

    if (length === 0) {
      return undefined;
    } else if (length === 1) {
      values = getValues(poss[0]);
      keys = Object.keys(poss[0]);
      return [ values[0],  keys[0]];
    } else {
      checkLanguageOnServer(poss, "e");
    }

  } else if (checkRussianCharacter(input)) {
    let ruPossibilities = filter(Cards[9], input);

    if (ruPossibilities[0]) {
      return [ bestPossibility(ruPossibilities, input), "ru-RU"];
    } else {
      return undefined;
    }

  } else {
    let dePossibilities = filter(Cards[0], input);
    let usPossibilities = filter(Cards[1], input);
    let esPossibilities = filter(Cards[2], input);
    let mxPossibilities = filter(Cards[3], input);
    let frPossibilities = filter(Cards[4], input);
    let itPossibilities = filter(Cards[5], input);
    let plPossibilities = filter(Cards[7], input);
    let brPossibilities = filter(Cards[8], input);

    if (dePossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "de-DE": bestPossibility(dePossibilities, input) };
    }
    if (usPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "en-US": bestPossibility(usPossibilities, input) };
    }
    if (esPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "es-ES": bestPossibility(esPossibilities, input) };
    }
    if (mxPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "es-MX": bestPossibility(mxPossibilities, input) };
    }

    if (frPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "fr-FR": bestPossibility(frPossibilities, input) };
    }

    if (itPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "it-IT": bestPossibility(itPossibilities, input) };
    }
    if (plPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "pl-PL": bestPossibility(plPossibilities, input) };
    }
    if (brPossibilities[0]) {
      length = Object.keys(poss).length;
      poss[length] = { "pt-BR": bestPossibility(brPossibilities, input) };
    }

    length = Object.keys(poss).length;

    priorityIndex = checkLanguageOnServer(poss, message);

    if (length === 0) {
      return undefined;
    } else if (length === 1) {
      values = getValues(poss[0]);
      keys = Object.keys(poss[0]);
      return [ values[0],  keys[0]];
    } else if (priorityIndex >= 0){
      values = getValues(poss[priorityIndex]);
      keys = Object.keys(poss[priorityIndex]);
      return [ values[0],  keys[0]];
    }
  }

  return undefined;
}

function bestPossibility(array, input) {
  let best = array[0],
  bestDif = levenshtein.get(input, best),
  dif = 0;
  _.map(array, (value) => {
    dif = levenshtein.get(input, value);
    if (dif < bestDif) {
      best = value;
      bestDif = dif;
    }
  });

  return best;
}

function checkLanguageOnServer(poss, message) {
  let defaultServer = "en-US";
  let server;

  let actualChannel = message.channel.id;

  _.map(channels, (value, key) => {
    if (key === actualChannel) {
      server = value;
    } else {
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

  return (priority !== -1) ? priority : defaultPriority;
}

function apiSearch(input, message, long) {
  let card = trimCard(input, message);

  if (card) {
    axios.post('https://gwent.io/api/obelix/v1/exoid', { "requests": [{"path":"cards.getByPathKey", "body":{"pathKey": stringToPathKey(card[0])}}] })
    .then((response) => {
      let data = response.data.results[0];

      message.reply({ embed: embedData(data, card, long) });
    }).catch(function (error) {
      console.log(error);
    });
  } else {
    message.author.createDM().then((channel) => {
      channel.send("Card not recognized");
    })
  }
}

function getImage(data) {
  let variation = Object.keys(data.variations)[0];
  return `https://cdn.zolmeister.com/gwent/images/cards/${variation}_low.png`;
}

function embedData(data, card, long) {
  let text = data.info[card[1]];
  let cats = categories(data, card[1]);

  const embed = new Discord.RichEmbed({
    color: colorFaction(data.faction),
    title: `**${card[0]}**`,
    type: "rich",
    description: text + "\n\n" + cats.join(" - "),
    url: `https://gwent.io/card/${stringToPathKey(card[0])}`,
    footer: { text: "Gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
  })
  if (long) {
    embed.setImage(getImage(data));
  }

  return embed;
}

function checkChannelPermission(channel) {
  restrictedChannels = [ "202165327650357249" ];

  // "202165327650357249" = #gwent-discussion

  let bool = true;

  _.map(restrictedChannels, (value) => {
    if (channel === value) {
      bool = false;
    }
  });

  return bool;
}

function reply(e, msg) {
  const firstBracket = msg.indexOf("[");
  const secondBracket = msg.substring(firstBracket).indexOf("]") + firstBracket;

  const firstBrace = msg.indexOf("{");
  const secondBrace = msg.substring(firstBrace).indexOf("}") + firstBrace;
  if (firstBracket !== -1 && (secondBracket - firstBracket) !== -1) {
    const card = msg.slice(firstBracket + 1, secondBracket).trim();
    const long = checkChannelPermission(e.channel.id);

    apiSearch(card, e, long);
    if (secondBracket > secondBrace) {
      reply(e, msg.substring(secondBracket));
    }
  }
  if (firstBrace !== -1 && (secondBrace - firstBrace) !== -1) {
    let card = msg.slice(firstBrace + 1, secondBrace);
    apiSearch(card, e, false);

    if (secondBrace > secondBracket) {
      reply(e, msg.substring(secondBrace));
    }
  }
}

client.on('message', message => {
  if (!message.author.bot) {
    const msg = message.content;
    try {
      if (message.isMentioned(client.user)) {
        let id = message.author.id;
        let ownerID;
        if (message.guild) {
          if (message.guild.available) {
            ownerID = message.guild.ownerID;
            if (id === ownerID) {
              addServer(message.guild.id, msg.substring(msg.indexOf('>') + 1).trim(), message);
            }
          }
        }

      } else {
        reply(message, msg.replace(/\"/g, ""), true);
      }
    } catch (e) {
      console.log(e);
    }
  }
});
