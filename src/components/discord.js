import DiscordJS from 'discord.js';
import { GwentDatabase, FirebaseDatabase } from './';
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
    this.client.login(this.token).then(() => {
      console.log('Connected');
      this.client.guilds.map((value, key) => console.log(`${value}  ${key}`));
    }).catch((err) => {
      console.error(err);
    });

    this.client.on('message', message => this.messageEvent(message));

    this.client.on('guildCreate', guild => this.newServerEvent(guild));

    this.fDatabase = new FirebaseDatabase(this.apiKey, this.databaseURL);
    this.cardsDatabase = new GwentDatabase(this.fDatabase);
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
                this.fDatabase.addServer(message.guild.id,
                  content.substring(content.indexOf('>') + 1).trim(),
                  message);
              }
            }
          }
        } else if (message.author.id === '215658764097945601' && message.content.trim() === '!gwent-check-memory') {
          console.log(this.cardsDatabase.getMemory());
        } else {
          this.checkMessage(message, content.replace(/"/g, ''));
        }
        // }
      } catch (e) {
        console.log(e);
      }
    }
  }

  checkMessage(message, content) {
    const firstBracket = content.indexOf('[');
    const secondBracket = content.substring(firstBracket).indexOf(']')
    + firstBracket;

    const firstBrace = content.indexOf('{');
    const secondBrace = content.substring(firstBrace).indexOf('}')
    + firstBrace;

    if (firstBracket !== -1 && (secondBracket - firstBracket) !== -1) {
      const card = content.slice(firstBracket + 1, secondBracket).trim();
      const long = checkChannelPermission(message.channel.id,
        restrictedChannels);

      this.cardsDatabase.apiSearch(card, message, long);
      if (secondBracket > secondBrace) {
        this.checkMessage(message, content.substring(secondBracket));
      }
    }
    if (firstBrace !== -1 && (secondBrace - firstBrace) !== -1) {
      const card = content.slice(firstBrace + 1, secondBrace);

      this.cardsDatabase.apiSearch(card, message, false);

      if (secondBrace > secondBracket) {
        this.checkMessage(message, content.substring(secondBrace));
      }
    }
  }

  newServerEvent(guild) {
    this.client.fetchUser('215658764097945601').then((user) => {
      const msg = `New server added: ${guild.name} with ${guild.memberCount
      } members, the region of the server is ${guild.region}`;
      if (user.dmChannel) {
        user.dmChannel.send(msg);
      } else {
        user.createDM((channel) => {
          channel.send(msg);
        });
      }
    }).catch(() => {
      console.log('Error 404! PabloSz not found');
    });
  }

}
