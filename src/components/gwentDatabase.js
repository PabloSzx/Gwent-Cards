import _ from "lodash";
import {
  translation,
  nicknames,
  cards_language,
  database,
  emotes,
  self_destruct,
} from "../data";
import {
  checkChineseOrJapaneseCharacter,
  checkRussianCharacter,
  colorFaction,
  filter,
  nicknameCheck,
  bestPossibility,
  getImage,
  getEquivalent,
  secondsTransition,
} from "../utils";

import DiscordJS from "discord.js";
import getValues from "object.values";

export default class GwentDatabase {
  constructor(fDatabase) {
    this.fDatabase = fDatabase;
  }

  embedData(data, card, long) {
    try {
      const text = data.info[card[1]];
      const cats = this.constructor.categories(data, card[1]);

      const embed = new DiscordJS.RichEmbed({
        color: colorFaction(data.faction),
        title: database[card[0]].name[card[1]],
        type: "rich",
        description: `${text}\n\n${cats.join(" - ")}`,
        url: `https://www.myesports.net/gwent/?cards&gid=${Object.keys(
          data.variations
        )[0].slice(0, -2)}`,
        footer: {
          text: "MyEsports.net",
          icon_url:
            "https://www.myesports.net/themes/esport/img/favicon/favicon-32x32.png",
        },
      });
      if (long) {
        embed.setImage(getImage(data));
      } else {
        embed.setThumbnail(getImage(data));
      }

      return embed;
    } catch (e) {
      console.error("Error encontrado en embedData");
      console.log("data:");
      console.log(data);
      console.log("card:");
      console.log(card);
      console.error(e);
    }
  }

  trimCard(param, channel) {
    let input = "";

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

    if (nickname[0]) {
      return [getEquivalent(nickname[0]), nickname[1]];
    } else if (checkChineseOrJapaneseCharacter(input)) {
      const jpPossibilities = filter(cards_language["ja-JP"], input);
      const cnPossibilities = filter(cards_language["zh-CN"], input);
      const twPossibilities = filter(cards_language["zh-TW"], input);

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

      if (channel.guild) {
        priorityIndex = this.fDatabase.checkLanguageOnServer(
          poss,
          channel.guild.id
        );
      } else {
        priorityIndex = this.fDatabase.checkLanguageOnServer(poss, undefined);
      }

      if (length === 0) {
        return undefined;
      } else if (length === 1) {
        values = getValues(poss[0]);
        keys = Object.keys(poss[0]);
        return [getEquivalent(values[0]), keys[0]];
      } else if (priorityIndex >= 0) {
        values = getValues(poss[priorityIndex]);
        keys = Object.keys(poss[priorityIndex]);
        return [getEquivalent(values[0]), keys[0]];
      }
      values = getValues(poss[0]);
      keys = Object.keys(poss[0]);
      return [getEquivalent(values[0]), keys[0]];
    } else if (checkRussianCharacter(input)) {
      const ruPossibilities = filter(cards_language["ru-RU"], input);

      if (ruPossibilities[0]) {
        return [
          getEquivalent(bestPossibility(ruPossibilities, input)),
          "ru-RU",
        ];
      }
      return undefined;
    } else {
      const dePossibilities = filter(cards_language["de-DE"], input);
      const usPossibilities = filter(cards_language["en-US"], input);
      const esPossibilities = filter(cards_language["es-ES"], input);
      const mxPossibilities = filter(cards_language["es-MX"], input);
      const frPossibilities = filter(cards_language["fr-FR"], input);
      const itPossibilities = filter(cards_language["it-IT"], input);
      const plPossibilities = filter(cards_language["pl-PL"], input);
      const brPossibilities = filter(cards_language["pt-BR"], input);

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

      if (channel.guild) {
        priorityIndex = this.fDatabase.checkLanguageOnServer(
          poss,
          channel.guild.id
        );
      } else {
        priorityIndex = this.fDatabase.checkLanguageOnServer(poss, undefined);
      }

      if (length === 0) {
        return undefined;
      } else if (length === 1) {
        values = getValues(poss[0]);
        keys = Object.keys(poss[0]);
        return [getEquivalent(values[0]), keys[0]];
      } else if (priorityIndex >= 0) {
        values = getValues(poss[priorityIndex]);
        keys = Object.keys(poss[priorityIndex]);
        return [getEquivalent(values[0]), keys[0]];
      } else {
        return [getEquivalent(getValues(poss[0])[0]), "en-US"];
      }
    }

    return undefined;
  }

  static categories(data, language) {
    const fields = [];

    fields[fields.length] = `*${translation[language].group}*: **${translation[
      language
    ]._group[data.type]}**`;

    let faction = data.faction;
    if (data.faction === "Northern Realms") {
      faction = "NorthernKingdom";
    }

    fields[fields.length] = `*${translation[language]
      .faction}*: **${translation[language]._faction[faction]}**`;

    const rarity = data.rarity;
    fields[fields.length] = `*${translation[language].rarity}*: **${translation[
      language
    ]._rarity[rarity]}**`;

    if (data.strength > 0) {
      fields[fields.length] = `*${translation[language].power}*: **${emotes[
        data.strength.toString()
      ]
        ? emotes[data.strength.toString()]
        : data.strength.toString()}**`;
    }

    const provision = data.provision;

    fields[fields.length] = `*Provision*: **${provision}**`;

    if (data.loyalties.length > 0) {
      fields[fields.length] = `${translation[language]
        .loyalty}: **${translation[language]._loyalty[data.loyalties[0]]}**`;
    }

    const categories = data.categories;
    let category = "";
    if (categories) {
      _.forIn(categories, (value, key) => {
        if (translation[language]._type[value]) {
          category += translation[language]._type[value];
        } else {
          category += value;
        }
        if (key < categories.length - 1) {
          category += ", ";
        }
      });

      if (data.categories.length > 0) {
        fields[fields.length] = `*${translation[language]
          .type}*: **${category}**`;
      }
    }
    return fields;
  }

  apiSearch(input, message, long) {
    const card = this.trimCard(input, message.channel);

    if (card) {
      const info = database[card[0]];
      if (info) {
        message
          .reply({ embed: this.embedData(info, card, long) })
          .then(msg =>
            console.log(
              `Card info successfully displayed in ${msg.guild
                ? `<${msg.channel.name}> channel from <${msg.guild
                    .name}> server`
                : `<${message.author.username}> direct message channel`}`
            )
          )
          .catch(() => {
            message.author
              .createDM()
              .then(channel => {
                channel
                  .send({ embed: this.embedData(info, card, long) })
                  .then(msg => {
                    console.log(
                      `Sent card info to <${message.author
                        .username}> direct message channel`
                    );
                  })
                  .catch(
                    err =>
                      err.message
                        ? console.error(
                            `Error!, ${err.message} called in gwentDatabase.js, line 322`
                          )
                        : console.error("Error in gwentDatabase line 322")
                  );
              })
              .catch(err => {
                err.message
                  ? console.error(
                      `Error!, ${err.message} called in gwentDatabase.js, line 330`
                    )
                  : console.error("Error in gwentDatabase line 330");
              });
          });
      }
    } else {
      let txt =
        "Card not recognized \n If you think it's an error, please, report the bug here: https://github.com/PabloSzx/Gwent-Cards/issues" +
        self_destruct;
      message
        .reply(txt)
        .then(m => {
          m.delete(10000);
          secondsTransition(m, txt, 1800);
        })
        .catch(
          err =>
            err.message
              ? console.error(
                  `Error!, ${err.message} called in gwentDatabase.js, line 352`
                )
              : console.error("Error in gwentDatabase line 352")
        );
    }
  }
}
