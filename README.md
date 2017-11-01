# Gwent-Cards-Bot

### https://pabloszx.github.io/Gwent-Cards/

## Add this bot to your server:
https://discordapp.com/oauth2/authorize?&client_id=318804439354048537&scope=bot&permissions=19456

## How to use
Anywhere you write (case insensitive), type: ["Name of card"] and the bot will reply you with all the card basic details and the image,
or type: {"Name of card"} and the bot will reply you only with the card basic details too, but with a thumbnail image.

The bot is currently working with an algorithm that compares your input with the most similar card and the bot will give you the better option. For example, if you type [adrenaline] you will receive "Adrenaline rush" info, and you can request multiple cards in a single message, for example: [adrenaline] [troll] [geralt] etc...

There are implemented shortcuts that you can use to write less, for example [dbomb] to get "Dimeritium Bomb" info (implemented for English and Russian at the moment).
The list of nicknames is available here https://docs.google.com/spreadsheets/d/1rxDfsX2BoAo6MKZFJewgZwZhxJQ22m9luaC8CqDWzk0/edit?usp=sharing.

The bot is currently supporting 12 simultaneous languages: English, Deutsch (German), Español (Spanish), Español LA (Latin American Spanish), Français (French), Italiano (Italian), 日本語 (Japanese), Polski (Polish), Português (Portuguese), Русский (Russian), 官话 (Chinese), 简体中文 (Chinese Taiwan).

In order to have a priority language, when a card coincidence has more than a language, the bot replies with the default chosen language (English by default).

If the admin wants to change the default bot language on his server, has to mention the bot with: "en-us" for English, "de-de" for German,
"es-es" for Spanish, "es-mx" for Latin American Spanish, "fr-fr" for French, "it-it" for Italian, "jp-jp" for Japanese,
"pl-pl" for Polish, "pt-br" for Portuguese, "ru-ru" for Russian, "zh-cn" for Chinese and "zh-tw" for Chinese Taiwan.

For example, in any channel of your server , write: "\@Gwent-Cards es-es" to set the Spanish on your default language (just the discord server owner can execute this command).

You can use "!top10" to get the top 10 in standard ladder, "!protop10" to get the top 10 in pro ladder and "!ladder nickname" to get the ladder information of a specific player.

(If you want to report a bug, or you have an idea to improve the bot, feel free to talk to me via discord, my nickname is @PabloSz#0327)

The images source i'm using is https://gwent.io/.

And the raw database where i get the information from is https://github.com/GwentCommunityDevelopers or https://github.com/GwentCommunityDevelopers/gwent-data-release

Some servers that are officialy using the bot are:

"Gwent Esp", https://discord.gg/8ceWwck.

Official Gwent discord server, https://discord.gg/DTPYChN.

"Gwent Taiwan", https://discord.gg/CRJbjsq.

"Gwent RU", https://discord.gg/gwentru.

## Screenshots
![Screenshot](https://i.imgur.com/s0wSkaj.png)
![Screenshot](https://i.imgur.com/B3RUNvv.png)
![Screenshot](https://i.imgur.com/8bhhZV5.png)
![Screenshot](https://i.imgur.com/5NGRqI1.png)
![Screenshot](https://i.imgur.com/WYYqmKV.png)
![Screenshot](https://i.imgur.com/zX7e8J0.png)
## How it's made?
It's using "Node.js" with mainly "Discord.js" library.
https://github.com/hydrabolt/discord.js/

It's currently hosted in Heroku
