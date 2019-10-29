/* eslint-disable complexity */
/* eslint-disable no-magic-numbers */
const Discord = require("discord.js");
const client = new Discord.Client();

const SteinStore = require("stein-js-client");
const db = new SteinStore(process.env.API);

const config = require("./config");

const setup = require("./setup");
const check = require("./check");
const create = require("./create");

client.login(process.env.TOKEN);

client.on("ready", () => {
    console.log(`${client.user.tag}を起動しました。`);
    client.user.setActivity("通話管理Bot");
    setup(client, config);
    setInterval(() => check(client, config, db), 60000);
});

client.on("message", message => {
    if (message.author.id !== config.owner) return;
    if (message.content === "vc+clean") message.channel.bulkDelete(99);
    if (message.channel.id !== config.channel) return;
    // eslint-disable-next-line no-magic-numbers
    if (message.content === "vc+setup") setup(client, config);
    if (message.author.id !== client.user.id) message.delete(1000);
});

// eslint-disable-next-line max-lines-per-function
client.on("messageReactionAdd", (messageReaction, user) => {
    if (user.bot) return;
    if (messageReaction.message.channel.id !== config.channel) return;
    create(client, messageReaction, user, config, db);
});
