const fs = require("fs");

module.exports = (client, config) => {
    let db = JSON.parse(fs.readFileSync(`${__dirname}/db.json`));

    console.log(db);
    db.forEach((element, index) => {
        console.log("checkt" + element);
        const time = Number(element.time);
        //300000
        if (Date.now() - time > 10000) {
            const voice_channel = client.channels.get(element.channel_id);

            try {
                if (voice_channel.members.first()) {
                    db[index].time = Date.now();
                    fs.writeFileSync(
                        `${__dirname}/db.json`,
                        JSON.stringify(db)
                    );
                } else {
                    voice_channel.delete();
                    client.channels
                        .get(config.log)
                        .messages.get(element.invite_msg)
                        .delete();
                    db.splice(index, 1);
                    fs.writeFileSync(
                        `${__dirname}/db.json`,
                        JSON.stringify(db)
                    );
                }
            } catch {}
        }
    });
};
