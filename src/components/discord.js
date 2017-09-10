import DiscordJS from 'discord.js';
import { GwentDatabase, FirebaseDatabase, TopTracker, UserTracker } from './';
import { restrictedChannels } from '../data';
import { checkChannelPermission } from '../utils';

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
        console.log('Connected');
        this.client.guilds.map((value, key) => console.log(`${value}  ${key}`));
      })
      .catch(err => {
        console.error(err);
      });
    this.fDatabase = new FirebaseDatabase(this.apiKey, this.databaseURL);
    this.cardsDatabase = new GwentDatabase(this.fDatabase);
    this.TopTracker = new TopTracker();
    this.UserTracker = new UserTracker();

    this.client.on('message', message => this.messageEvent(message));

    this.client.on('guildCreate', guild => this.newServerEvent(guild));
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
                  content.substring(content.indexOf('>') + 1).trim(),
                  message
                );
              }
            }
          }
        } else if (
          message.author.id === '215658764097945601' &&
          message.content.trim().slice(0, 4) === '!say'
        ) {
          this.sendMessageMainChannel(
            message.content
              .trim()
              .slice(4)
              .trim()
          );
        } else {
          this.checkMessage(message, content.replace(/"/g, ''));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  checkMessage(message, content) {
    if (
      content
        .trim()
        .slice(0, 6)
        .toLowerCase() === '!top10'
    ) {
      this.TopTracker.request(message);
      return;
    } else if (
      content
        .trim()
        .slice(0, 7)
        .toLowerCase() === '!ladder'
    ) {
      this.UserTracker.request(content.slice(7).trim(), message);
      return;
    }

    const firstBracket = content.indexOf('[');
    const secondBracket =
      content.substring(firstBracket).indexOf(']') + firstBracket;

    const firstBrace = content.indexOf('{');
    const secondBrace = content.substring(firstBrace).indexOf('}') + firstBrace;

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
              .has('SEND_MESSAGES')
          ) {
            n += 1;
            await this.sleep(5000 * n);
            value.defaultChannel
              .send(
                '`<NEW ANNOUNCEMENT>`\n\n' +
                  message +
                  ' \n\n <@318804439354048537> Developer, <@215658764097945601>'
              )
              .then(msg => console.log(`Sent message in ${value.name} server`))
              .catch(err => console.error(err));
          }
        }
      }
    });
  }

  newServerEvent(guild) {
    this.client
      .fetchUser('215658764097945601')
      .then(user => {
        const msg = `New server added: ${guild.name} with ${guild.memberCount} members, the region of the server is ${guild.region}`;
        if (user.dmChannel) {
          user.dmChannel.send(msg).catch(err => console.error(err));
        } else {
          user.createDM(channel => {
            channel.send(msg).catch(err => console.error(err));
          });
        }
      })
      .catch(() => {
        console.error('Error 404! PabloSz not found');
      });
  }
}
