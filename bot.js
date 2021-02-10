const Discord = require('discord.js');

const {
    prefix,
    token,
    rssFeed
} = require('./config.json');

const client = new Discord.Client()

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setActivity('for support requests', { type: "WATCHING" });
})

client.on('message', async (msg) => {
    if (msg.author.bot) {
        return;
    }
    if (!msg.content.startsWith(prefix)){
        return;
    }

    if (msg.content.startsWith(`${prefix}ping`)) {
        msg.reply('Pong');
    }
})

client.login(token)