const fs = require("fs");

module.exports = (client, config) => {
  let db = JSON.parse(fs.readFileSync(`${__dirname}/db.json`));

  db.forEach((element, index) => {
    const time = Number(element.time);
    if (Date.now() - time > 300000) {
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
          console.log(`create channel: ${voice_channel.name}`)
        }
      } catch { }
    }
  });
};
