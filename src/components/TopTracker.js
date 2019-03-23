import axios from "axios";
import _ from "lodash";
import { self_destruct } from "../data";
import { secondsTransition } from "../utils";
import DiscordJS from "discord.js";

class TopTracker {
  constructor() {}

  embedData(info) {
    const embed = new DiscordJS.RichEmbed({
      title: "TOP 10",
      url: `https://gwent.io/leaderboard?page=1`,
      footer: {
        text: "Gwent.io",
        icon_url: "https://gwent.io/images/gwent_io_icon_256.png",
      },
    });
    let txt = "";
    _.forIn(info, (value, key) => {
      if (key < 10) {
        txt = "";
        txt = txt.concat(value.score.toString().paddingRight(" ", 5) + " | ");
        txt = txt.concat(value.continent.paddingRight(" ", 9) + " | ");
        txt = txt.concat(
          value.wins_count.toString().paddingRight(" ", 6) + " | "
        );
        txt = txt.concat(
          value.losses_count.toString().paddingRight(" ", 12) + " | "
        );
        txt = txt.concat(
          value.draws_count.toString().paddingRight(" ", 11) + " | "
        );
        const rate = Math.ceil(
          value.wins_count / (value.wins_count + value.losses_count) * 100
        );
        txt = txt.concat(rate + "%", "\n\n");
        embed.addField(value.position + ".- " + value.username, txt);
      } else {
        return false;
      }
    });

    embed.setDescription("**MMR | Region | Wins | Losses | Draws | WinRate**");
    embed.setColor([_.random(0, 255), _.random(0, 255), _.random(0, 255)]);
    embed.setTimestamp();
    return embed;
  }

  request(msg) {
    axios
      .post("https://gwent.io/api/obelix/v1/exoid", {
        requests: [
          {
            path: "leaderboard.getPage",
            body: { page: 1, q: "" },
          },
        ],
      })
      .then(response => {
        const data = response.data.results[0];
        if (data) {
          msg
            .reply({ embed: this.embedData(data.ranks) })
            .then(
              console.log(
                `Top 10 info successfully displayed in ${msg.guild
                  ? `<${msg.channel.name}> channel from <${msg.guild
                      .name}> server`
                  : `<${msg.author.username}> direct message channel`}`
              )
            )
            .catch(
              err =>
                err.message
                  ? console.error(
                      `Error!, ${err.message} called in TopTracker.js, line 80`
                    )
                  : console.error("Error in TopTracker line 80")
            );
        } else {
          let txt = `User not tracked \n If you want ***${user}*** to be tracked, please sign up on https://gwent.io/ ${self_destruct}`;
          msg
            .reply(txt)
            .then(m => {
              m.delete(10000);
              secondsTransition(m, txt, 1800);
            })
            .catch(
              err =>
                err.message
                  ? console.error(
                      `Error!, ${err.message} called in TopTracker.js, line 100`
                    )
                  : console.error("Error in TopTracker line 100")
            );
        }
      })
      .catch(err => {
        err.message
          ? console.error(
              `Error!, ${err.message} called in TopTracker.js, line 109`
            )
          : console.error("Error in TopTracker line 109");
      });
  }
}

export default TopTracker;
