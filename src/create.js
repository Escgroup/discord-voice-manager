const fs = require("fs");

const list = {
  A: {
    ja: "雑談",
    en: "free talk",
    emoji: "💬",
  },
  B: {
    ja: "ゲーム",
    en: "games",
    emoji: "🎮",
  },
  C: {
    ja: "音楽",
    en: "music",
    emoji: "🎶",
  },
};

const create = (client, messageReaction, user, config, type) => {
  const db = JSON.parse(fs.readFileSync(`${__dirname}/db.json`));
  messageReaction.message.channel
    .send(
      `${user}
${list[type].ja}用VCを作成します。
名前を入力してください。

Create a ${list[type].en} VC.
Please enter VC name.`
    )
    .then(message => {
      message.channel
        .awaitMessages(msg => msg.author.id === user.id, {
          max: 1,
          time: 10000,
          errors: ["time"],
        })
        .then(collected => {
          const category = client.channels.get(config.category);
          message.guild
            .createChannel(
              `vm ${list[type].emoji}: ${
              collected.first().content
              }`,
              {
                type: "voice",
                parent: category,
              }
            )
            .then(channel => {
              channel.createInvite({ maxAge: 600 }).then(invite =>
                client.channels
                  .get(config.log)
                  .send(user + invite.url)
                  .then(msg => {
                    console.log(`create channel: ${channel.name} (${user.username})`)
                    db.push({
                      channel_id: channel.id,
                      channel_name: channel.name,
                      user_id: user.id,
                      user_name: user.username,
                      time: channel.createdTimestamp,
                      invite_msg: msg.id,
                    });
                    fs.writeFileSync(
                      `${__dirname}/db.json`,
                      JSON.stringify(db)
                    );
                    message.delete(1000);
                  })
              );
            });
        })
        .catch(() =>
          message.channel
            .send(
              "おそすぎです、キャンセルしました。\nToo late, canceled."
            )
            .then(msg => {
              message.delete(1000);
              msg.delete(1000);
            })
        );
    });
};

module.exports = (client, messageReaction, user, config, db) => {
  switch (messageReaction.emoji.name) {
    case config.A:
      create(client, messageReaction, user, config, "A", db);
      break;
    case config.B:
      create(client, messageReaction, user, config, "B", db);
      break;
    case config.C:
      create(client, messageReaction, user, config, "C", db);
      break;
    default:
      break;
  }
  messageReaction.remove(user);
};
