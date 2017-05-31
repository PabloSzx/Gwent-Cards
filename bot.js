let Discordie = require('discordie');
let axios = require('axios');
let client = new Discordie();
let request = require('request').defaults({ encoding: null });
let Cards = require('./cards.json');
let levenshtein = require('fast-levenshtein');
let _ = require('lodash');

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

function categories(input) {
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

function trimCard(input) {
  let poss = _.filter(Cards, (value) => {
    if (value.toLowerCase().indexOf(input.toLowerCase()) !== -1) return value
  });
  if (poss[0]) {
    let menor = poss[0];
    let menorDif = levenshtein.get(input.toLowerCase(), menor.toLowerCase());
    let dif;
    _.map(poss, (value) => {
      dif = levenshtein.get(input.toLowerCase(), value.toLowerCase());
      if (dif < menorDif) {
        menor = value;
        menorDif = dif;
      }
    });
    return menor.replace(/\'/g, "").replace(/\s/g, "-").toLowerCase();
  }
  return undefined;
}

function reply(e, msg) {
  const firstBracket = msg.indexOf("[");
  const secondBracket = msg.substring(firstBracket).indexOf("]") + firstBracket;

  if (firstBracket !== -1 && (secondBracket - firstBracket) !== -1) {
    let card = msg.slice(firstBracket + 1, secondBracket);
    card = trimCard(card.trim());
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
          description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
          image: { url: img, width: 140, height: 210},
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
