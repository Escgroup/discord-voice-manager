import { Client } from 'ecstar';
import { TextChannel, MessageEmbed } from 'discord.js';
import { emojis } from './emojis';

export const setup = async (client: Client) => {
  const channel = client.channels.cache.get(
    client.config?.channel.manager
  ) as TextChannel;

  const embed = new MessageEmbed()
    .setTitle('Voice Manager')
    .setDescription(
      `用途にあった一時的な通話を作成します。
        以下のオプションから選択してください。

        Create a temporary call that suits your purpose.
        Choose from the following options:
        `
    )
    .addField('雑談/Free talk', emojis.get('A'))
    .addField('ゲーム/Games', emojis.get('B'))
    .addField('音楽/Music', emojis.get('C'));

  const setupMmessage = await channel.send({ embed });

  emojis.forEach((emoji) => setupMmessage.react(emoji));
};
