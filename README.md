# Gwent-Cards-Bot

### https://pabloszx.github.io/Gwent-Cards/

## Add this bot to your server:
https://discordapp.com/oauth2/authorize?&client_id=318804439354048537&scope=bot&permissions=19456

## How to use
Anywhere you write (case insensitive), type: ["Name of card"] and the bot will reply you with all the card basic details and the image,
or type: {"Name of card"} and the bot will reply you only with the card basic details too, but with a thumbnail image.

The bot is currently working with an algorithm that compares your input with the most similar card and the bot will give you the better option. For example, if you type [adrenaline] you will receive "Adrenaline rush" info, and you can request multiple cards in a single message, for example: [adrenaline] [troll] [geralt] etc...

The bot is currently supporting 12 simultaneous languages: English, Deutsch (German), Español (Spanish), Español LA (Latin American Spanish), Français (French), Italiano (Italian), 日本語 (Japanese), Polski (Polish), Português (Portuguese), Русский (Russian), 官话 (Chinese), 简体中文 (Chinese Taiwan).

In order to have a priority language, when a card coincidence has more than a language, the bot replies with the default chosen language (English by default).

If the admin wants to change the default bot language on his server, has to mention the bot with: "en-us" for English, "de-de" for German,
"es-es" for Spanish, "es-mx" for Latin American Spanish, "fr-fr" for French, "it-it" for Italian, "jp-jp" for Japanese,
"pl-pl" for Polish, "pt-br" for Portuguese, "ru-ru" for Russian, "zh-cn" for Chinese and "zh-tw" for Chinese Taiwan.

For example, in any channel of your server , write: "\@Gwent-Cards es-es" to set the Spanish on your default language (just the discord server owner can execute this command).

Additionally you can write:
 - "!protop10" to get the top 10 in pro ladder in https://masters.playgwent.com/en/rankings/pro-ladder/
 - "!gwent-events" to get the last 5 Gwents events of https://www.myesports.net/
 - "!gwent-news" to get the last 5 Gwent news of https://www.myesports.net/
 - "!gwent-decks user" to get the up to 5 best decks of the specifed user of https://www.myesports.net/ 

(If you want to report a bug, or you have an idea to improve the bot, feel free to talk to me via discord, my nickname is @PabloSz#0327)

The images source i'm using is https://www.myesports.net/

And the raw database where i get the information from is https://github.com/GwentCommunityDevelopers or https://github.com/GwentCommunityDevelopers/gwent-data-release

Some servers that are officially using the bot are:

Official GWENT: The Witcher Card Game Discord server, https://discord.gg/playgwent

Gwent discord community server, https://discord.gg/DTPYChN

"Gwent Taiwan", https://discord.gg/CRJbjsq

"Gwent RU", https://discord.gg/gwentru

## Screenshots
![Screenshot](https://i.imgur.com/zVI6ncR.png)
![Screenshot](https://i.imgur.com/QFcrUMG.png)
![Screenshot](https://i.imgur.com/6gOONIo.png)
![Screenshot](https://i.imgur.com/VfEHWwc.png)
![Screenshot](https://i.imgur.com/x9Sml7J.png)
![Screenshot](https://i.imgur.com/pEODzxq.png)
![Screenshot](https://i.imgur.com/der5QIC.png)
## How it's made?
It's using "Node.js" with mainly "Discord.js" library.
https://github.com/hydrabolt/discord.js/

It's currently hosted in Heroku
