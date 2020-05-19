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
    try {
      if (voiceChannel.members.first()) {
        dbfile[index].time = Date.now();
        db.save(dbfile);
      } else {
        voiceChannel.delete();

        dbfile.splice(index, 1);

        db.save(dbfile);
      }
    } catch {}
  });
};
