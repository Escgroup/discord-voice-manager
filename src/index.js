const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config");

const setup = require("./setup");
const check = require("./check");
const create = require("./create");

client.login(process.env.TOKEN);

client.on("ready", () => {
    console.log(`${client.user.tag}を起動しました。`);
    client.user.setActivity("通話管理Bot");
    setup(client, config);
    //60000
    setInterval(() => check(client, config), 1000);
});

client.on("message", message => {
    if (message.author.id === config.owner) {
        if (message.content === "vc+clean") message.channel.bulkDelete(99);
        if (message.channel.id !== config.channel) return;
        if (message.content === "vc+setup") setup(client, config);
    }
    if (message.channel.id !== config.channel) return;
    if (message.author.id !== client.user.id) message.delete(1000);
});

client.on("messageReactionAdd", (messageReaction, user) => {
    if (user.bot) return;
    if (messageReaction.message.channel.id !== config.channel) return;
    create(client, messageReaction, user, config);
});
