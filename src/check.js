/* eslint-disable consistent-return */
/* eslint-disable no-magic-numbers */
module.exports = (client, config, db) => {
    client.channels
        .filter(channel => channel.name.startsWith("vm"))
        .forEach(channel => {
            db.read("main", {
                limit: 1,
                search: { channel_id: channel.id },
            }).then(data => {
                const time = Number(data[0].time);
                if (Date.now() - time > 300000) {
                    const voice_channel = client.channels.get(
                        data[0].channel_id
                    );

                    if (voice_channel.members.first()) {
                        return db.edit("main", {
                            search: { channel_id: channel.id },
                            set: { time: Date.now() },
                        });
                    }
                    voice_channel.delete();
                }
            });
        });
};
