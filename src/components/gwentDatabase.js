import axios from 'axios';
import _ from 'lodash';
import DiscordJS from 'discord.js';
import getValues from 'object.values';
import { translation, nicknames, cards } from '../data';
import { stringToPathKey, checkChineseOrJapaneseCharacter,
  checkRussianCharacter, colorFaction, filter, nicknameCheck,
  bestPossibility, getImage,
} from '../utils';

export default class GwentDatabase {
  constructor(fDatabase) {
    this.fDatabase = fDatabase;
    this.database = {};
  }

  embedData(data, card, long) {
    const text = data.info[card[1]];
    const cats = this.constructor.categories(data, card[1]);

    const embed = new DiscordJS.RichEmbed({
      color: colorFaction(data.faction),
      title: card[0],
      type: 'rich',
      description: `${text}\n\n${cats.join(' - ')}`,
      url: `https://gwent.io/card/${stringToPathKey(card[0])}`,
      footer: { text: 'Gwent.io',
        icon_url: 'https://gwent.io/images/gwent_io_icon_256.png' },
    });
    if (long) {
      embed.setImage(getImage(data));
    }

    return embed;
  }

  trimCard(param, channel) {
    let input = '';

    if (param) {
      input = param.trim();
    }

    if (input.length <= 1) {
      return undefined;
    }

    const poss = {};
    let length = 0;
    let values;
    let keys;
    let priorityIndex;
    const nickname = nicknameCheck(input, nicknames);

    if (nickname) {
      return [nickname, 'en-US'];
    } else if (checkChineseOrJapaneseCharacter(input)) {
      const jpPossibilities = filter((cards.cards)['ja-JP'], input);
      const cnPossibilities = filter((cards.cards)['zh-CN'], input);
      const twPossibilities = filter((cards.cards)['zh-TW'], input);

      if (jpPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'ja-JP': bestPossibility(jpPossibilities, input) };
      }

      if (cnPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'zh-CN': bestPossibility(cnPossibilities, input) };
      }

      if (twPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'zh-TW': bestPossibility(twPossibilities, input) };
      }

      length = Object.keys(poss).length;

      if (channel.guild) {
        priorityIndex = this.fDatabase.checkLanguageOnServer(poss, channel.guild.id);
      } else {
        priorityIndex = this.fDatabase.checkLanguageOnServer(poss, undefined);
      }

      if (length === 0) {
        return undefined;
      } else if (length === 1) {
        values = getValues(poss[0]);
        keys = Object.keys(poss[0]);
        return [values[0], keys[0]];
      } else if (priorityIndex >= 0) {
        values = getValues(poss[priorityIndex]);
        keys = Object.keys(poss[priorityIndex]);
        return [values[0], keys[0]];
      }
    } else if (checkRussianCharacter(input)) {
      const ruPossibilities = filter((cards.cards)['ru-RU'], input);

      if (ruPossibilities[0]) {
        return [bestPossibility(ruPossibilities, input), 'ru-RU'];
      }
      return undefined;
    } else {
      const dePossibilities = filter((cards.cards)['de-DE'], input);
      const usPossibilities = filter((cards.cards)['en-US'], input);
      const esPossibilities = filter((cards.cards)['es-ES'], input);
      const mxPossibilities = filter((cards.cards)['es-MX'], input);
      const frPossibilities = filter((cards.cards)['fr-FR'], input);
      const itPossibilities = filter((cards.cards)['it-IT'], input);
      const plPossibilities = filter((cards.cards)['pl-PL'], input);
      const brPossibilities = filter((cards.cards)['pt-BR'], input);

      if (dePossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'de-DE': bestPossibility(dePossibilities, input) };
      }
      if (usPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'en-US': bestPossibility(usPossibilities, input) };
      }
      if (esPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'es-ES': bestPossibility(esPossibilities, input) };
      }
      if (mxPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'es-MX': bestPossibility(mxPossibilities, input) };
      }

      if (frPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'fr-FR': bestPossibility(frPossibilities, input) };
      }

      if (itPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'it-IT': bestPossibility(itPossibilities, input) };
      }
      if (plPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'pl-PL': bestPossibility(plPossibilities, input) };
      }
      if (brPossibilities[0]) {
        length = Object.keys(poss).length;
        poss[length] = { 'pt-BR': bestPossibility(brPossibilities, input) };
      }

      length = Object.keys(poss).length;

      if (channel.guild) {
        priorityIndex = this.fDatabase.checkLanguageOnServer(poss, channel.guild.id);
      } else {
        priorityIndex = this.fDatabase.checkLanguageOnServer(poss, undefined);
      }

      if (length === 0) {
        return undefined;
      } else if (length === 1) {
        values = getValues(poss[0]);
        keys = Object.keys(poss[0]);
        return [values[0], keys[0]];
      } else if (priorityIndex >= 0) {
        values = getValues(poss[priorityIndex]);
        keys = Object.keys(poss[priorityIndex]);
        return [values[0], keys[0]];
      }
    }

    return undefined;
  }

  static categories(data, language) {
    const fields = [];

    fields[fields.length] = `*${translation[language].group}*: **${(translation[language]._group)[data.type]}**`;

    let faction = data.faction;
    if (data.faction === 'Northern Realms') {
      faction = 'NorthernKingdom';
    }

    fields[fields.length] = `*${translation[language].faction}*: **${translation[language]._faction[faction]}**`;

    const rarity = (getValues(data.variations)[0]).rarity;
    fields[fields.length] = `*${translation[language].rarity}*: **${(translation[language]._rarity)[rarity]}**`;

    if (data.strength > 0) {
      fields[fields.length] = `*${translation[language].power}*: **${data.strength.toString()}**`;
    }

    const positions = data.positions;
    let position;
    if (positions.length === 1) {
      position = positions[0];
    } else if (positions.length === 3) {
      position = 'Any';
    }

    fields[fields.length] = `*${translation[language].lane}*: **${(translation[language]._lane)[position]}**`;

    if (data.loyalties.length > 0) {
      fields[fields.length] = `*${translation[language].loyalty}*: **${(translation[language]._loyalty)[(data.loyalties)[0]]}**`;
    }

    const categories = data.categories;
    let category = '';
    if (categories) {
      _.map(categories, (value, key) => {
        if (translation[language]._type[value]) {
          category += ((translation[language]._type)[value]);
        } else {
          category += value;
        }
        if (key < (categories.length - 1)) {
          category += ', ';
        }
      });

      if (data.categories.length > 0) {
        fields[fields.length] = `*${translation[language].type}*: **${category}**`;
      }
    }
    return fields;
  }

  apiSearch(input, message, long) {
    const card = this.trimCard(input, message.channel);

    if (card) {
      const info = this.database[stringToPathKey(card[0])];
      if (info) {
        message.reply({ embed: this.embedData(info, card, long) })
        .then(msg => console.log(`Sent card info ${msg.channel.name ? `in ${msg.channel.name} on ${msg.channel.guild.name} server` : `to ${msg.channel.recipient.username} direct message channel`}`))
       .catch(() => {
         message.author.createDM().then((channel) => {
           channel.send({ embed: this.embedData(info, card, long) }).then((msg) => {
             console.log(`Sent card info to ${msg.channel.recipient.username} direct message channel`);
           });
         }).catch((err) => {
           console.error(err);
         });
       });
      } else {
        axios.post('https://gwent.io/api/obelix/v1/exoid', {
          requests: [{ path: 'cards.getByPathKey',
            body: { pathKey: stringToPathKey(card[0]) } }] })
          .then((response) => {
            const data = response.data.results[0];
            this.database[stringToPathKey(card[0])] = data;
            message.reply({ embed: this.embedData(data, card, long) })
         .then(msg => console.log(`Sent card info ${msg.channel.name ? `in ${msg.channel.name} on ${msg.channel.guild.name} server` : `to ${msg.channel.recipient.username} direct message channel`}`))
        .catch(() => {
          message.author.createDM().then((channel) => {
            channel.send({ embed: this.embedData(data, card, long) }).then((msg) => {
              console.log(`Sent card info to ${msg.channel.recipient.username} direct message channel`);
            });
          }).catch((err) => {
            console.error(err);
          });
        });
          }).catch((err) => {
            console.error(err);
          });
      }
    } else {
      message.author.createDM().then((channel) => {
        channel.send('Card not recognized');
      }).catch((err) => {
        console.error(err);
      });
    }
  }
}
