const Discord = require('discord.js');
const Parser = require('rss-parser');
const stripHtml = require('string-strip-html')

const {
    prefix,
    token,
    rssFeed,
    rssChannel
} = require('./config.json');

const client = new Discord.Client()
const parser = new Parser()


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`)
    console.log(Date.UTC())
    client.user.setActivity('for support requests', { type: "WATCHING" });
    rssFeedFunc()
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

async function rssFeedFunc() {
    // get time when first running then convert to NZT
    var timeNow = new Date();

    // get feed and convert date to NZT
    let feed = await parser.parseURL(rssFeed);
    try {
        var time = feed.items[0].pubDate;
    } catch (error) {
        
    }
    

    // check if was in the last 2 minutes
    if (timeNow - new Date(time) < 120000) {

        // send discord message

        var incidentEmbed = new Discord.MessageEmbed()
        .setColor('#ff1100')
        .setTitle(feed.items[0].title)
        .setURL(feed.items[0].link)
        .setAuthor(client.user.username, client.user.avatarURL(), "https://support.boomboxdiscord.dev")
        .setTimestamp(new Date(feed.items[0].pubDate))
        .setFooter(client.user.username, client.user.avatarURL());

        //get content and split it
        var content = feed.items[0].content;
        content = content.replace( /(<([^>]+)>)/ig, '');
        content = content.split('.')

        for (i = 0; i < content.length - 1; i++) {
            incidentEmbed.addField(`Update number: ${i + 1}`, content[i])
        }
        
        client.channels.cache.get(rssChannel).send(incidentEmbed)
    }
}

setInterval(async function() {
    rssFeedFunc();
}, 120000)


client.login(token)