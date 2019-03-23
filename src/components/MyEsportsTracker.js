import axios from "axios";
import _ from "lodash";
import { self_destruct_30 } from "../data";
import { parseMySports, secondsTransition } from "../utils";
import DiscordJS from "discord.js";

class MyEsportsTracker {
  constructor() {}

  embedEvents(info) {
    const embed = new DiscordJS.RichEmbed({
      title: "Gwent Events",
      url: "https://www.myesports.net/",
      footer: {
        text: "MyEsports.net",
        icon_url:
          "https://www.myesports.net/themes/esport/img/favicon/favicon-32x32.png",
      },
    });

    _.forEach(info, value => {
      embed.addField(
        value.titleEN,
        `${value.descriptionEN} \n${value.linkToMorinfoEN}`
      );
    });

    embed.setThumbnail(
      "https://www.myesports.net/themes/esport/images/esports/logo.png"
    );

    return embed;
  }

  embedDecks(info, name, url, image) {
    const embed = new DiscordJS.RichEmbed({
      title: `${name} Decks`,
      url,
      footer: {
        text: "MyEsports.net",
        icon_url:
          "https://www.myesports.net/themes/esport/img/favicon/favicon-32x32.png",
      },
    });

    _.forEach(info, value => {
      value.description = value.description.replace(/<br\/>/gi, " ");
      embed.addField(
        value.nameEN,

        `*Faction*: **${value.factionEN}** | *Leader*: **${value.leaderEN}** | ${value.description
          ? "*Description*: **" +
            _.truncate(value.description, { length: 200 }) +
            "**"
          : ""} *Scrap*: **${value.scrap}** | *Votes*: **${value.votes}** | *Link*: **${value.link}**`
      );
    });

    embed.setThumbnail(image.replace(/ /gi, "%20"));

    return embed;
  }

  embedNews(info) {
    const embed = new DiscordJS.RichEmbed({
      title: "Gwent News",
      url: "https://www.myesports.net/",
      footer: {
        text: "MyEsports.net",
        icon_url:
          "https://www.myesports.net/themes/esport/img/favicon/favicon-32x32.png",
      },
    });

    _.forEach(info, value => {
      embed.addField(
        value.titleEN,
        `${value.textEN.replace(/<br\/>/gi, "\n")} \n${value.linkToPage}`
      );
    });

    embed.setThumbnail(
      "https://www.myesports.net/themes/esport/images/esports/logo.png"
    );

    return embed;
  }

  async requestEvents(message, n = 5) {
    try {
      if (_.toInteger(n) > 5) n = 5;

      const res = await axios.get(
        `https://www.myesports.net/bot/?events=${_.toInteger(n) || 5}`
      );
      const data = parseMySports(res.data);
      const embed = this.embedEvents(data);
      message
        .reply({ embed: embed })
        .then(msg => {
          console.log(
            `MYESPORTS Events successfully displayed in ${msg.guild
              ? `<${msg.channel.name}> channel from <${msg.guild.name}> server`
              : `<${message.author.username}> direct message channel`}`
          );
        })
        .catch(
          err =>
            err.message
              ? console.error(
                  `Error!, ${err.message} called in MySportsTracker.js, line 168`
                )
              : console.error("Error in gwentDatabase line 168")
        );
    } catch (err) {
      console.error("Error in MySportsTracker.requestEvents", err);
    }
  }

  async requestDecks(message, name) {
    try {
      const res = await axios.get(
        `https://www.myesports.net/bot/?decks=${name}`
      );
      const data = parseMySports(res.data);

      if (_.isEmpty(data)) {
        _.delay(() => {
          let txt =
            'Write "!gwent-decks username" to use, for example "!gwent-decks pawloex" \n Decks information provided by https://myesports.net, register there to see your decks. Only decks from current Gwent Update are shown.' +
            self_destruct_30;
          message
            .reply(txt)
            .then(m => {
              m.delete(32000);
              new Promise(() => {
                secondsTransition(m, txt, 1800);
              });
            })
            .catch(
              err =>
                err.message
                  ? console.error(
                      `Error!, ${err.message} called in gwentDatabase.js, line 352`
                    )
                  : console.error("Error in gwentDatabase line 352")
            );
        });

        return;
      }

      const embed = this.embedDecks(
        _.slice(_.sortBy(data, "votes").reverse(), 0, 5),
        name,
        _.get(_.head(data), "linkPlayerProfile", "https://myesports.net"),
        _.get(_.head(data), "linkPlayerAvatar", "")
      );
      message
        .reply({ embed: embed })
        .then(msg => {
          console.log(
            `MYESPORTS Decks of ${name} successfully displayed in ${msg.guild
              ? `<${msg.channel.name}> channel from <${msg.guild.name}> server`
              : `<${message.author.username}> direct message channel`}`
          );
        })
        .catch(
          err =>
            err.message
              ? console.error(
                  `Error!, ${err.message} called in MySportsTracker.js, line 155`
                )
              : console.error("Error in gwentDatabase line 155")
        );
    } catch (err) {
      console.error("Error in MySportsTracker.requestDecks", err);
    }
  }

  async requestNews(message, n = 5) {
    try {
      if (_.toInteger(n) > 5) n = 5;
      const res = await axios.get(
        `https://www.myesports.net/bot/?news=${_.toInteger(n) || 5}`
      );
      const data = parseMySports(res.data);
      const embed = this.embedNews(data);
      message
        .reply({ embed: embed })
        .then(msg => {
          console.log(
            `MYESPORTS News successfully displayed in ${msg.guild
              ? `<${msg.channel.name}> channel from <${msg.guild.name}> server`
              : `<${message.author.username}> direct message channel`}`
          );
        })
        .catch(
          err =>
            err.message
              ? console.error(
                  `Error!, ${err.message} called in MySportsTracker.js, line 168`
                )
              : console.error("Error in gwentDatabase line 168")
        );
    } catch (err) {
      console.error("Error in MySportsTracker.requestNews", err);
    }
  }
}

export default MyEsportsTracker;
