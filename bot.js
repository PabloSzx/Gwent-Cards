const Discordie = require('discordie');
const axios = require('axios');
const levenshtein = require('fast-levenshtein');
const _ = require('lodash');
const Cards = require('./cards.json');

const client = new Discordie();
//test server token
// const token = 'MzE4ODc4NzEyMzgyNzUwNzMx.DA4y6g.ZxV8SUmfhmRdd5KSxQ8zkBV8hWs';

//heroku token
const token = process.env.token;

client.connect({
  token
});

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);
});

function cleanText(input) {
  text = decodeURI(input.replace(/<strong>/gi, "").replace(/<\/strong>/gi, ""))
  .replace(/&#8217;/gi, "\'")
  return text
}

function categoriesEnglish(input) {
  let fields = [];
  let obj = {name: "", value: ""};
  str = input.replace(/<li>/gi, "");

  const array = str.split("<\/li>");

  for (let i = 0; i < array.length; i++) {
    array[i] = array[i]
    .replace(/<strong>/gi, "")
    .replace(/<\/strong>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/&#8217;/gi, "\'");

    while (array[i].indexOf("<a") !== -1) {
      array[i] = array[i].substring(0, array[i].indexOf("<a")) +
      array[i].substring(array[i].indexOf("\">") + 2);
    }
    const name = array[i].substring(0, array[i].indexOf(":")).replace(/\t/g,"");
    const value = array[i].substring(array[i].indexOf(":") + 2).replace(/\t/g,"");
    if (name && value) {
      fields[fields.length] = JSON.stringify({ name, value }, (value, key) =>
      (`*${key.name}*: **${key.value}**`)).replace(/\\n/g, "").replace(/"/g, "");
    }
  }

  return fields;
}

function categoriesSpanish(input) {
  let fields = [];
  str = input.replace(/<tr>/gi, "");

  const array = str.split("<\/tr>");

  for (let i = 0; i < array.length; i++) {
    array[i] = array[i]
    .replace("<td class=\"label\">", "")
    .replace("<td class=\"value\">", "")
    .replace(new RegExp('</td>$'), '')
    .replace(/:/g, "")
    .replace(/&#8217;/gi, "\'")
    .trim();
    const name = array[i].split("</td>")[0];
    const value = array[i].split("</td>")[1];
    if (name && value) {
      fields[fields.length] = JSON.stringify({ name, value }, (value, key) =>
      (`*${key.name.trim()}*: **${key.value.trim()}**`)).replace(/\\n/g, "").replace(/"/g, "");
    }
  }

  return fields;

}

function colorFaction(cats) {
  let fact = "Neutral";
  fact = cats.indexOf("Monsters") !== -1 ? "Monsters" : fact;
  fact = cats.indexOf("Nilfgaard") !== -1 ? "Nilfgaard" : fact;
  fact = cats.indexOf("Northern Realms") !== -1 ? "Northern Realms" : fact;
  fact = cats.indexOf("Scoia\'tael") !== -1 ? "Scoia'tael" : fact;
  fact = cats.indexOf("Skellige") !== -1 ? "Skellige" : fact;

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

function noTildes(input) {
  return input.replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u");
}

function trimCard(input) {
  let dif, menorEnglish, menorEnglishDif, menorSpanish, menorSpanishDif;
  let toReturn = undefined;
  let englishPossibilities = _.filter(Cards[0], (value) => {
    if (value.toLowerCase().indexOf(input.toLowerCase()) !== -1) return value
  });
  let spanishPossibilities = _.filter(Cards[1], (value) => {
    if (noTildes(value).toLowerCase().indexOf(noTildes(input).toLowerCase()) !== -1) return value
  });
  if (englishPossibilities[0]) {
    menorEnglish = englishPossibilities[0];
    menorEnglishDif = levenshtein.get(input.toLowerCase(), menorEnglish.toLowerCase());
    _.map(englishPossibilities, (value) => {
      dif = levenshtein.get(input.toLowerCase(), value.toLowerCase());
      if (dif < menorEnglishDif) {
        menorEnglish = value;
        menorEnglishDif = dif;
      }
    });
  }
  if (spanishPossibilities[0]) {
    menorSpanish = spanishPossibilities[0];
    menorSpanishDif = levenshtein.get(noTildes(input.toLowerCase()), noTildes(menorSpanish.toLowerCase()));
    _.map(spanishPossibilities, (value) => {
      dif = levenshtein.get(noTildes(input.toLowerCase()), noTildes(value.toLowerCase()));
      if (dif < menorSpanishDif) {
        menorSpanish = value;
        menorSpanishDif = dif;
      }
    });
  }

  if (englishPossibilities[0] && spanishPossibilities[0]) {
    const menor = ((menorSpanishDif <= menorEnglishDif) ? menorSpanish : menorEnglish).replace(/\'/g, "").replace(/\s/g, "-").toLowerCase();
    if (menorSpanishDif <= menorEnglishDif) { //si es <= español es prioridad, si es < ingles es prioridad
      toReturn = [menor, "spanish"];
    } else {
      toReturn = [menor, "english"];
    }
  } else if (englishPossibilities[0]) {
    menorEnglish = menorEnglish.replace(/\'/g, "").replace(/\s/g, "-").toLowerCase();
    toReturn = [menorEnglish, "english"];
  } else if (spanishPossibilities[0]){
    menorSpanish = menorSpanish.replace(/\'/g, "").replace(/\s/g, "-").toLowerCase();
    toReturn = [menorSpanish, "spanish"];
  }
  return toReturn;
}

function englishSearch(e, card) {
  if (card) {
    const url = `http://gwentify.com/cards/${card}/`;
    axios.get('https://allorigins.us/get?method=raw&url=' +
    encodeURIComponent(url) + '&callback=?').then((response) => {
      const imgStart = '<div class="card-img"><a href=\"',
      nameStart = '<h1 class="card-name">',
      textStart = '<div class="card-text"><p>',
      catsStart = '<ul class="card-cats">',
      data = response.data,
      img = data.substring(data.indexOf(imgStart) + imgStart.length)
      .split('\"')[0],
      name = data.substring(data.indexOf(nameStart) + nameStart.length)
      .split('<')[0],
      text = data.substring(data.indexOf(textStart) + textStart.length)
      .split('</p>')[0],
      cats = data.substring(data.indexOf(catsStart) + catsStart.length)
      .split('</ul>')[0];

      e.message.reply("", false, {
        color: colorFaction(cats),
        title: `${name.replace(/&#8217;/gi, "\'")}`,
        type: "rich",
        description: cleanText(text) + "\n\n" + categoriesEnglish(cats).join(" - "),
        image: { url: img, width: 140, height: 210},
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

function spanishSearch(e, card) {
  if (card) {
    card = card.replace(/á/g, "%c3%a1").replace(/é/g, "%c3%c9").replace(/í/g, "%c3%ad").replace(/ó/g, "%c3%b3").replace(/ú/g, "%c3%ba");
    const url = `https://gwent.io/es-ES/carta/${card}/`;
    axios.get('https://allorigins.us/get?method=raw&url=' +
    encodeURIComponent(url) + '&callback=?').then((response) => {
      const imgStart = 'class="z-card-image"><img src="',
      nameStart = '<h1 class="name">',
      textStart = '<div class="label">Capacidad</div><div class="line"></div><div class="value">',
      catsStart = '<div class="stats-card"><table class="stats">',
      data = response.data,
      img = data.substring(data.indexOf(imgStart) + imgStart.length)
      .split('\"')[0],
      name = data.substring(data.indexOf(nameStart) + nameStart.length)
      .split('<')[0],
      text = data.substring(data.indexOf(textStart) + textStart.length)
      .split('<')[0],
      cats = data.substring(data.indexOf(catsStart) + catsStart.length)
      .split('<tr><td class="label">Crear</td>')[0];

      e.message.reply("", false, {
        color: colorFaction(cats),
        title: `${name.replace(/&#8217;/gi, "\'")}`,
        type: "rich",
        description: cleanText(text) + "\n\n" + categoriesSpanish(cats).join(" - "),
        image: { url: img, width: 140, height: 210},
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

function reply(e, msg) {
  const firstBracket = msg.indexOf("[");
  const secondBracket = msg.substring(firstBracket).indexOf("]") + firstBracket;

  if (firstBracket !== -1 && (secondBracket - firstBracket) !== -1) {
    let card = msg.slice(firstBracket + 1, secondBracket);
    card = trimCard(card.trim());

    if (card) {
      switch (card[1]) {
        case "spanish":
        spanishSearch(e, card[0]);
        break;
        case "english":
        englishSearch(e, card[0]);
        break;
        default:
        //empty
      }
    }

    reply(e, msg.substring(secondBracket))
  }
}

client.Dispatcher.on("MESSAGE_CREATE", e => {
  if (!e.message.author.bot) {
    const msg = e.message.content;
    reply(e, msg);


  }
});
