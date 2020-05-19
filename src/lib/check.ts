import { Client } from 'ecstar';
import { TextChannel, VoiceChannel } from 'discord.js';
import { db } from './database';

export const check = async (client: Client) => {
  let dbfile = await db.getFile();
  dbfile.forEach(async (value, index) => {
    if (!(Date.now() - value.time > 300000)) return;
    const voiceChannel = client.channels.cache.get(
      value.channel_id
    ) as VoiceChannel;
    if (!voiceChannel) {
      await dbfile.splice(index, 1);
      await db.save(dbfile);
      await (
        await (client.channels.cache.get(
          client.config?.channel.board
        ) as TextChannel).messages.fetch(value.invite_msg)
      )?.delete();
      return;
    }
    try {
      if (voiceChannel.members.first()) {
        dbfile[index].time = Date.now();
        db.save(dbfile);
      } else {
        await voiceChannel.delete();

        await (
          await (client.channels.cache.get(
            client.config?.channel.board
          ) as TextChannel).messages.fetch(value.invite_msg)
        ).delete();

        await dbfile.splice(index, 1);

        await db.save(dbfile);
      }
    } catch (err) {
      console.log(err);
    }
  });
};
