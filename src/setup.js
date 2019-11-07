module.exports = async (client, config) => {
    const channel = client.channels.get(config.channel);
    channel.bulkDelete(99);
    const msg = await channel.send({
        embed: {
            title: "Voice Manager",
            description:
                "用途にあった一時的な通話を作成します。\n以下のオプションから選択してください。\n\nCreate a temporary call that suits your purpose.\nChoose from the following options:\n",
            fields: [
                {
                    name: "雑談(small talk)",
                    value: config.A,
                },
                {
                    name: "ゲーム(games)",
                    value: config.B,
                },
                {
                    name: "音楽(music)",
                    value: config.C,
                },
            ],
        },
    });
    msg.react(config.A).then(() =>
        msg.react(config.B).then(() => msg.react(config.C))
    );

    channel.setTopic(msg.id);
};
