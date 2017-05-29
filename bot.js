var Discordie = require('discordie');
var axios = require("axios");
var client = new Discordie();
const fs = require('fs');
var request = require('request').defaults({ encoding: null });

const token = process.env.token;

client.connect({
  token: token
});

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log(e);
  console.log("Connected as: " + client.User.username);
});

function cleanText(input) {
  return decodeURI(input
    .replace(/<strong>/gi, "")
    .replace(/<\/strong>/gi, ""))
    .replace(/&#8217;/gi, "\'");
  }

  function categories(input) {
    let fields = [];
    let obj = {name: "", value: ""};
    str = input.replace(/<li>/gi, "");

    const array = str.split("<\/li>");

    for (var i = 0; i < array.length; i++) {
      array[i] = array[i]
      .replace(/<strong>/gi, "")
      .replace(/<\/strong>/gi, "")
      .replace(/<\/a>/gi, "")
      .replace(/&#8217;/gi, "\'");

      array[i] = array[i].substring(0, array[i].indexOf("<a")) + array[i].substring(array[i].indexOf("\">") + 2);
      const name = array[i].substring(0, array[i].indexOf(":")).replace(/\t/g,"");
      const value = array[i].substring(array[i].indexOf(":") + 2).replace(/\t/g,"");
      if (name && value) {
        fields[fields.length] = { name, value };
      }
      console.log(array[i]);
    }

    console.log(fields);
    return fields;
  }



  client.Dispatcher.on("MESSAGE_CREATE", e => {
    if (!e.message.author.bot) {
      const msg = e.message.content;
      const firstBracket = msg.indexOf("[");
      const secondBracket = msg.substring(firstBracket).indexOf("]")+firstBracket;

      if (firstBracket !== -1 && secondBracket !== -1) {
        const card = msg.slice(firstBracket + 1, secondBracket);
        const url = `http://gwentify.com/cards/${card.trim().toLowerCase().replace(' ', '-')}/`;
        axios.get('https://allorigins.us/get?method=raw&url=' + encodeURIComponent(url) + '&callback=?').then(function (response) {
          const imgStart = '<div class="card-img"><a href=\"'
          const nameStart = '<h1 class="card-name">';
          const textStart = '<div class="card-text"><p>';
          const catsStart = '<ul class="card-cats">';
          const data = response.data;
          const img = data.substring(data.indexOf(imgStart)+imgStart.length).split('\"')[0];
          const name = data.substring(data.indexOf(nameStart)+nameStart.length).split('<')[0];
          const text = data.substring(data.indexOf(textStart)+textStart.length).split('</p>')[0];
          const cats = data.substring(data.indexOf(catsStart)+catsStart.length).split('</ul>')[0];

          e.message.reply("", false, {
            color: 0x3498db,
            title: name,
            type: "rich",
            description: cleanText(text),
            fields: categories(cats),
            image: { url: img, width: 200, height: 300},
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
  });
