import proLadder from 'gwent-pro-ladder-lib';
import _ from 'lodash';
import DiscordJS from 'discord.js';
import { secondsTransition } from '../utils';
import { self_destruct } from '../data';

class TopProTracker {
  constructor() {}

  embedData(info) {
    const embed = new DiscordJS.RichEmbed({
      title: 'TOP 10 PRO LADDER',
      url: `https://masters.playgwent.com/en/rankings/pro-ladder/`,
      footer: {
        text: 'masters.playgwent.com',
        icon_url: 'https://i.imgur.com/InrLLyy.png',
      },
    });
    let txt = '';
    _.forIn(info, (value, key) => {
      if (key < 10) {
        txt = '';
        txt = txt.concat(value.mmr.toString().paddingRight(' ', 5) + ' | ');
        txt = txt.concat(value.country.iso
            .toUpperCase()
            .paddingLeft(' ', 6) + '    '
            + ' | ');
        txt = txt.concat(
          value.total_matches.toString() + ' | '
        );
        embed.addField((parseInt(key) + 1).toString() + '.- ' + value.player, txt);
      } else {
        return false;
      }
    });

    embed.setDescription('**MMR | Region | Matches**');
    embed.setColor([_.random(0, 255), _.random(0, 255), _.random(0, 255)]);
    embed.setTimestamp();
    return embed;
  }

  request(msg) {
    proLadder
      .get_ladder_players(10)
      .then(ladder => {
        msg
          .reply({ embed: this.embedData(ladder) })
          .then(console.log(`Pro Ladder Top 10 info successfully displayed in ${msg.guild ? `<${msg.channel.name}> channel from <${msg.guild.name}> server` : `<${msg.author.username}> direct message channel`}`))
          .catch(err => console.error(err));
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default TopProTracker;
