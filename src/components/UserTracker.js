import axios from 'axios';
import _ from 'lodash';
import DiscordJS from 'discord.js';
import { secondsTransition } from '../utils';
import { self_destruct } from '../data';

class UserTracker {
  constructor() {}

  embedData(info) {
    const embed = new DiscordJS.RichEmbed({
      title: info.username,
      url: `https://gwent.io/user/${info.username}`,
      footer: {
        text: 'Gwent.io',
        icon_url: 'https://gwent.io/images/gwent_io_icon_256.png',
      },
    });
    let txt = '';
    txt = txt.concat('*Position:*   **', info.position, '**   - ');
    txt = txt.concat('*MMR:*   **', info.score, '**\n');
    txt = txt.concat('*WINS:*   **', info.wins_count, '**   - ');
    txt = txt.concat('*LOSES:*   **', info.losses_count, '**   - ');
    txt = txt.concat('*DRAWS:*   **', info.draws_count, '**   - ');
    txt = txt.concat(
      '*Win Rate:*   **',
      Math.ceil(info.wins_count / (info.wins_count + info.losses_count) * 100) +
        '%',
      '**'
    );

    embed.setDescription(txt);
    embed.setTimestamp();
    embed.setColor([_.random(0, 255), _.random(0, 255), _.random(0, 255)]);
    return embed;
  }

  request(user, msg) {
    axios
      .post('https://gwent.io/api/obelix/v1/exoid', {
        requests: [
          {
            path: 'users.getByUsername',
            body: { username: user },
          },
        ],
      })
      .then(response => {
        const data = response.data.results[0];
        if (data) {
          msg
            .reply({ embed: this.embedData(_.last(data.ranks)) })
            .then(
              console.log(
                `User ${user} tracking info successfully displayed in ${msg.guild
                  ? `<${msg.channel.name}> channel from <${msg.guild
                      .name}> server`
                  : `<${msg.author.username}> direct message channel`}`
              )
            )
            .catch(err => console.error(err));
        } else {
          let txt = `User not available\n If you want ***${user}*** to be tracked, please register him on https://gwent.io/ ${self_destruct}`;
          msg
            .reply(txt)
            .then(m => {
              m.delete(10000);
              secondsTransition(m, txt, 1800);
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
}

export default UserTracker;
