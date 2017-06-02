# Gwent-Cards-Bot

## Add this bot to your server:
https://discordapp.com/oauth2/authorize?&client_id=318804439354048537&scope=bot&permissions=0
## How to use
Anywhere you write (case insensitive), type: ["Name of card"] and the bot will reply you with all the card basic details and the image,
or type: {"Name of card"} and the bot will reply you only with the card basic details, without the image.

The bot is currently working with an algorithm that compares your input with the most similar card and the bot will give you the better option. For example, if you type [adrenaline] you will receive "Adrenaline rush" info, and you can request multiple cards in a single message, for example: [adrenaline] [troll] [geralt] etc...

There are implemented shortcuts that you can use to write less, for example [dbomb] to get "Dimeritium Bomb" info.
The list of nicknames is available here https://docs.google.com/spreadsheets/d/1rxDfsX2BoAo6MKZFJewgZwZhxJQ22m9luaC8CqDWzk0/edit?usp=sharing.

Currently the bot supports English and Spanish versions of cards for Gwent.
(If you want to help me to add another language to the bot, feel free to talk to me via discord, my nickname is @PabloSz#0327)


The database i'm using is https://gwent.io/.

A couple servers that are using this bot is "Gwent Esp", https://discord.gg/8ceWwck, and Official Gwent discord server, https://discord.gg/DTPYChN.



### Special thanks to:
\@nickgaunaetc for helping on spanish version
\@switchblade420 for helping on nicknames database
## Screenshot
![Screenshot](https://i.imgur.com/AnO7Sov.png)


## How it's made?
It's using "Node.js" with mainly "Discordie" library.
https://github.com/qeled/discordie

It's currently hosted in Heroku
