/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-params */
/* eslint-disable id-length */
const list = {
    A: {
        ja: "雑談",
        en: "small talk",
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

const create = (client, messageReaction, user, config, type, db) => {
    messageReaction.message.channel
        .send(
            `${list[type].ja}用VCを作成します。
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
                    collected.first().delete();
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
                            db.append("main", [
                                {
                                    channel_id: channel.id,
                                    channel_name: channel.name,
                                    user_id: user.id,
                                    user_name: user.username,
                                    time: channel.createdTimestamp,
                                },
                            ]);
                            channel.createInvite({ maxAge: 600 }).then(invite =>
                                message.channel.send(invite.url).then(msg => {
                                    message.delete(1000);
                                    msg.delete(100000);
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
