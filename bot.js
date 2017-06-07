const Discordie = require('discordie');
const axios = require('axios');
const levenshtein = require('fast-levenshtein');
const _ = require('lodash');
const Cards = require('./cards.json');
const Nicknames = require('./nicknames.json');

const client = new Discordie();
//test server token
const token = 'MzE4ODc4NzEyMzgyNzUwNzMx.DA4y6g.ZxV8SUmfhmRdd5KSxQ8zkBV8hWs';

//heroku token
// const token = process.env.token;

client.connect({
  token
});

let channels;

// console.log("cantidad de cartas a analizar: " + Cards[0].length);
let c = 0;

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);
  channels = (_.map(client.Guilds.toArray(), (value) => value.textChannels));

  // console.log(channels);
  // channels = _.map(channels, (val) => _.map(val , (value, key) =>
  //     [ value.id, value.guild_id, value.name ]
  //   )
  // );

  // console.log(channels);
});

function checkChineseOrJapaneseCharacter(input) {
  if (input.match(/[\u3400-\u9FBF]/)) {
    return true;
  }

  return false;
}

function cleanText(input) {
  text = input.replace(/<strong>/gi, "**").replace(/<\/strong>/gi, "**")
  .replace(/&#8217;/gi, "\'").replace(/<br>/gi, "\n").replace(/<p>/gi, "").replace(/<\/p>/gi, "");
  return text
}

function categories(input) {
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

function ignoreSpelling(input) {
  return input
  .replace(/á/g, "a").replace(/é/g, "e")
  .replace(/í/g, "i").replace(/ó/g, "o")
  .replace(/ú/g, "u").replace(/'/g, "")
  .replace(/:/g, "")
  ;
}

function trimCard(input) {

  if (input.length <= 1) {
    return undefined;
  }

  let menorEnglish, menorEnglishDif, menorSpanish,
  menorSpanishDif, dif, nickname, toReturn;

  if (checkChineseOrJapaneseCharacter(input)) {
    let chinesePossibilities = _.filter(Cards[2], (value) => {
      if (value.indexOf(input.trim()) !== -1) return value
    });

    if (chinesePossibilities[0]) {
      menorChinese = chinesePossibilities[0];
      menorChineseDif = levenshtein.get(input.toLowerCase(), menorChinese.toLowerCase());
      _.map(chinesePossibilities, (value) => {
        dif = levenshtein.get(input.toLowerCase(), value.toLowerCase());
        if (dif < menorEnglishDif) {
          menorChinese = value;
          menorChineseDif = dif;
        }
      });

      toReturn = [menorChinese, "chinese"];

    }

    return toReturn;
  }

  _.map(Nicknames, (value, key) => {
    _.map(value, (val) => {
      if (val.toLowerCase() === input.toLowerCase()) {
        nickname = key;
      }
    });
  });

  if (nickname) {
    nickname = nickname.replace(/\'/g, "").replace(/\s/g, "-").toLowerCase();
    return [nickname, "english"];
  }

  let englishPossibilities = _.filter(Cards[0], (value) => {
    if (ignoreSpelling(value).toLowerCase().indexOf(ignoreSpelling(input).toLowerCase()) !== -1) return value
  });

  let spanishPossibilities = _.filter(Cards[1], (value) => {
    if (ignoreSpelling(value).toLowerCase().indexOf(ignoreSpelling(input).toLowerCase()) !== -1) return value
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
    menorSpanishDif = levenshtein.get(ignoreSpelling(input.toLowerCase()), ignoreSpelling(menorSpanish.toLowerCase()));
    _.map(spanishPossibilities, (value) => {
      dif = levenshtein.get(ignoreSpelling(input.toLowerCase()), ignoreSpelling(value.toLowerCase()));
      if (dif < menorSpanishDif) {
        menorSpanish = value;
        menorSpanishDif = dif;
      }
    });
  }

  if (englishPossibilities[0] && spanishPossibilities[0]) {
    const menor = ((menorSpanishDif <= menorEnglishDif) ? menorSpanish : menorEnglish).replace(/\'/g, "").replace(/\s/g, "-").toLowerCase();
    if (menorSpanishDif <= menorEnglishDif) {
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

function spanishSearch(e, card, long) {
  if (card) {
    let carta = card.replace(/á/g, "%C3%A1").replace(/é/g, "%C3%A9")
    .replace(/í/g, "%C3%AD").replace(/ó/g, "%C3%B3")
    .replace(/ú/g, "%C3%BA").replace(/%3A/g, "").replace(/-/g, "%2D")
    .replace(/ñ/g, "%C3%B1").toLowerCase();
    const url = `https://gwent.io/es-ES/carta/${carta}`;
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
      .split('</div>')[0],
      cats = data.substring(data.indexOf(catsStart) + catsStart.length)
      .split('<tr><td class="label">Crear</td>')[0];
      if (long) {
        e.message.reply("", false, {
          color: colorFaction(cats),
          title: `${name.replace(/&#8217;/g, "\'").replace(/&#39;/g, "\'")}`,
          type: "rich",
          description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
          image: { url: img, width: 112, height: 168},
          url: url,
          footer: { text: "Información gracias a Gwent.io, visita www.gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
        });
      } else {
        // c+=1;
        // console.log(c);
        // console.log({
        //   color: colorFaction(cats),
        //   title: `${name.replace(/&#8217;/g, "\'").replace(/&#39;/g, "\'")}`,
        //   type: "rich",
        //   description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
        //   url: url,
        //   footer: { text: "Información gracias a Gwent.io, visita www.gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
        // });

        e.message.reply("", false, {
          color: colorFaction(cats),
          title: `${name.replace(/&#8217;/g, "\'").replace(/&#39;/g, "\'")}`,
          type: "rich",
          description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
          url: url,
          footer: { text: "Información gracias a Gwent.io, visita www.gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
        });

      };

    })
    .catch((error) => {
      console.log(error);
    });
  }
}

function englishSearch(e, card, long) {
  if (card) {
    const url = `https://gwent.io/en-US/card/${encodeURIComponent(card).replace(/%3A/g, "")}`;
    axios.get('https://allorigins.us/get?method=raw&url=' +
    encodeURIComponent(url) + '&callback=?').then((response) => {
      const imgStart = 'class="z-card-image"><img src="',
      nameStart = '<h1 class="name">',
      textStart = '<div class="label">Ability</div><div class="line"></div><div class="value">',
      catsStart = '<div class="stats-card"><table class="stats">',
      data = response.data,
      img = data.substring(data.indexOf(imgStart) + imgStart.length)
      .split('\"')[0],
      name = data.substring(data.indexOf(nameStart) + nameStart.length)
      .split('<')[0],
      text = data.substring(data.indexOf(textStart) + textStart.length)
      .split('</div>')[0],
      cats = data.substring(data.indexOf(catsStart) + catsStart.length)
      .split('<tr><td class="label">Craft</td>')[0];
      if (long) {
        e.message.reply("", false, {
          color: colorFaction(cats),
          title: `${name.replace(/&#8217;/g, "\'").replace(/&#39;/g, "\'")}`,
          type: "rich",
          description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
          image: { url: img, width: 112, height: 168},
          url: url,
          footer: { text: "Powered by Gwent.io, visit www.gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
        });
      } else {
        // c+=1;
        // console.log(c);
        // console.log({
        //   color: colorFaction(cats),
        //   title: `${name.replace(/&#8217;/g, "\'").replace(/&#39;/g, "\'")}`,
        //   type: "rich",
        //   description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
        //   url: url,
        //   footer: { text: "Información gracias a Gwent.io, visita www.gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
        // });

        e.message.reply("", false, {
          color: colorFaction(cats),
          title: `${name.replace(/&#8217;/g, "\'").replace(/&#39;/g, "\'")}`,
          type: "rich",
          description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
          url: url,
          footer: { text: "Powered by Gwent.io, visit www.gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
        });
      };
    })
    .catch((error) => {
      console.log(error);
    });
  }
}


function chineseSearch(e, card, long) {
  if (card) {
    const url = `https://gwent.io/zh-TW/%E5%8D%A1%E7%89%8C/${encodeURIComponent(card)}/`;
    axios.get('https://allorigins.us/get?method=raw&url=' +
    encodeURIComponent(url) + '&callback=?').then((response) => {
      const imgStart = 'class="z-card-image"><img src="',
      nameStart = '<h1 class="name">',
      textStart = '<div class="label">' + '能力' + '</div><div class="line"></div><div class="value">',
      catsStart = '<div class="stats-card"><table class="stats">',
      data = response.data,
      img = data.substring(data.indexOf(imgStart) + imgStart.length)
      .split('\"')[0],
      name = data.substring(data.indexOf(nameStart) + nameStart.length)
      .split('<')[0],
      text = data.substring(data.indexOf(textStart) + textStart.length)
      .split('</div>')[0],
      cats = data.substring(data.indexOf(catsStart) + catsStart.length)
      .split('<tr><td class="label">' + '合成' + '</td>')[0];

      if (long) {
        e.message.reply("", false, {
          color: colorFaction(cats),
          title: `${name}`,
          type: "rich",
          description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
          image: { url: img, width: 112, height: 168},
          url: url,
          footer: { text: "來源由Gwent.io提供，詳細資料請到www.gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
        });
      } else {
        // c+=1;
        // console.log(c);
        // console.log({
        //   color: colorFaction(cats),
        //   title: `${name.replace(/&#8217;/g, "\'").replace(/&#39;/g, "\'")}`,
        //   type: "rich",
        //   description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
        //   url: url,
        //   footer: { text: "Información gracias a Gwent.io, visita www.gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
        // });

        e.message.reply("", false, {
          color: colorFaction(cats),
          title: `${name.replace(/&#8217;/g, "\'").replace(/&#39;/g, "\'")}`,
          type: "rich",
          description: cleanText(text) + "\n\n" + categories(cats).join(" - "),
          url: url,
          footer: { text: "來源由Gwent.io提供，詳細資料請到www.gwent.io", icon_url: "https://gwent.io/images/gwent_io_icon_256.png" }
        });
      };
    })
    .catch((error) => {
      console.log(error);
    });
  }
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
    let card = msg.slice(firstBracket + 1, secondBracket);
    card = trimCard(card.trim());

    const long = checkChannelPermission(e.message.channel_id);
    if (card) {
      switch (card[1]) {
        case "spanish":
        {
          spanishSearch(e, card[0], long);
          break;
        }
        case "english":
        {
          englishSearch(e, card[0], long);
          break;
        }
        case "chinese":
        {
          chineseSearch(e, card[0], long);
          break;
        }
        default:
        //empty
      }
    }
    if (secondBracket > secondBrace) {
      reply(e, msg.substring(secondBracket));
    }
  }
  if (firstBrace !== -1 && (secondBrace - firstBrace) !== -1) {
    let card = msg.slice(firstBrace + 1, secondBrace);
    card = trimCard(card.trim());

    if (card) {
      switch (card[1]) {
        case "spanish":
        {
          spanishSearch(e, card[0], false);
          break;
        }
        case "english":
        {
          englishSearch(e, card[0], false);
          break;
        }
        case "chinese":
        {
          chineseSearch(e, card[0], false);
          break;
        }
        default:
        //empty
      }
    }
    if (secondBrace > secondBracket) {
      reply(e, msg.substring(secondBrace));
    }
  }
}

client.Dispatcher.on("MESSAGE_CREATE", e => {
  if (!e.message.author.bot) {
    const msg = e.message.content;
    try {
      // _.map(Cards[0], (val, key) => {
      //   console.log("val " + val + " key " + key);
      //   reply(e, "{" + val + "}")
      // })
      reply(e, msg.replace(/\"/g, ""), true);
    } catch (e) {
      console.log(e);
    }
  }
});
