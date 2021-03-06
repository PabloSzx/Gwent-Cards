import { restrictedChannels } from "../data";
import { checkChannelPermission } from "../utils";
import {
  GwentDatabase,
  FirebaseDatabase,
  TopTracker,
  TopProTracker,
  MyEsportsTracker,
} from "./";
import DiscordJS from "discord.js";

export default class Discord {
  constructor(token, apiKey, databaseURL) {
    this.token = token;
    this.apiKey = apiKey;
    this.databaseURL = databaseURL;
  }

  start() {
    this.client = new DiscordJS.Client();
    this.client
      .login(this.token)
      .then(() => {
        console.log("Connected");
        this.client.guilds.map((value, key) => console.log(`${value}  ${key}`));
      })
      .catch(err => {
        err.message
          ? console.error(
              `Error!, ${err.message} called in discord.js, line 28`
            )
          : console.error("Error in discord.js line 28");
      });
    this.fDatabase = new FirebaseDatabase(this.apiKey, this.databaseURL);
    this.cardsDatabase = new GwentDatabase(this.fDatabase);
    this.TopTracker = new TopTracker();
    this.TopProTracker = new TopProTracker();
    this.MyEsportsTracker = new MyEsportsTracker();

    this.client.on("message", message => this.messageEvent(message));

    this.client.on("guildCreate", guild => this.newServerEvent(guild));
  }

  messageEvent(message) {
    if (!message.author.bot) {
      const content = message.content;
      try {
        if (message.isMentioned(this.client.user)) {
          const id = message.author.id;
          if (message.guild) {
            if (message.guild.available) {
              const ownerID = message.guild.ownerID;
              if (id === ownerID) {
                this.fDatabase.addServer(
                  message.guild.id,
                  content.substring(content.indexOf(">") + 1).trim(),
                  message
                );
              }
            }
          }
        } else if (
          message.author.id === "215658764097945601" &&
          message.content.trim().slice(0, 4) === "!say"
        ) {
          this.sendMessageMainChannel(
            message.content
              .trim()
              .slice(4)
              .trim()
          );
        } else {
          this.checkMessage(message, content.replace(/"/g, ""));
        }
      } catch (e) {
        const err = e;
        //console.error(e);
        err.message
          ? console.error(
              `Error!, ${err.message} called in discord.js, line 81`
            )
          : console.error("Error in discord.js line 81");
      }
    }
  }

  checkMessage(message, content) {
    if (
      content
        .trim()
        .slice(0, 11)
        .toLowerCase() === "!gwent-news"
    ) {
      this.MyEsportsTracker.requestNews(message, content.trim().slice(11));
      return;
    } else if (
      content
        .trim()
        .slice(0, 13)
        .toLowerCase() === "!gwent-events"
    ) {
      this.MyEsportsTracker.requestEvents(message, content.trim().slice(13));
      return;
    } else if (
      content
        .trim()
        .slice(0, 12)
        .toLowerCase() === "!gwent-decks"
    ) {
      this.MyEsportsTracker.requestDecks(
        message,
        content
          .trim()
          .slice(12)
          .trim()
      );
      return;
    } else if (
      content
        .trim()
        .slice(0, 9)
        .toLowerCase() === "!protop10"
    ) {
      this.TopProTracker.request(message);
      return;
    }

    const firstBracket = content.indexOf("[");
    const secondBracket =
      content.substring(firstBracket).indexOf("]") + firstBracket;

    const firstBrace = content.indexOf("{");
    const secondBrace = content.substring(firstBrace).indexOf("}") + firstBrace;

    if (firstBracket !== -1 && secondBracket - firstBracket !== -1) {
      const card = content.slice(firstBracket + 1, secondBracket).trim();
      const long = checkChannelPermission(
        message.channel.id,
        restrictedChannels
      );

      this.cardsDatabase.apiSearch(card, message, long);
      if (secondBracket > secondBrace) {
        this.checkMessage(message, content.substring(secondBracket));
      }
    }
    if (firstBrace !== -1 && secondBrace - firstBrace !== -1) {
      const card = content.slice(firstBrace + 1, secondBrace);

      this.cardsDatabase.apiSearch(card, message, false);

      if (secondBrace > secondBracket) {
        this.checkMessage(message, content.substring(secondBrace));
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendMessageMainChannel(message) {
    let n = 0;
    this.client.guilds.every(async value => {
      if (value.available) {
        if (value.defaultChannel) {
          if (
            value.defaultChannel
              .permissionsFor(this.client.user)
              .has("SEND_MESSAGES")
          ) {
            n += 1;
            await this.sleep(5000 * n);
            value.defaultChannel
              .send(
                "`<NEW ANNOUNCEMENT>`\n\n" +
                  message +
                  " \n\n <@318804439354048537> Developer, <@215658764097945601>"
              )
              .then(msg => console.log(`Sent message in ${value.name} server`))
              .catch(
                err =>
                  err.message
                    ? console.error(
                        `Error!, ${err.message} called in discord.js, line 172`
                      )
                    : console.error("Error in line discord.js 172")
              );
          }
        }
      }
    });
  }

  newServerEvent(guild) {
    this.client
      .fetchUser("215658764097945601")
      .then(user => {
        const msg = `New server added: ${guild.name} with ${guild.memberCount} members, the region of the server is ${guild.region}`;
        if (user.dmChannel) {
          user.dmChannel
            .send(msg)
            .catch(
              err =>
                err.message
                  ? console.error(
                      `Error!, ${err.message} called in discord.js, line 190`
                    )
                  : console.error("Error in discord.js line 190")
            );
        } else {
          user.createDM(channel => {
            channel
              .send(msg)
              .catch(
                err =>
                  err.message
                    ? console.error(
                        `Error!, ${err.message} called in discord.js, line 205`
                      )
                    : console.error("Error in discord.js line 205")
              );
          });
        }
      })
      .catch(() => {
        console.error("Error 404! PabloSz not found");
      });
  }
}
