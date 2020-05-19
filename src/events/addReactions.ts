import { Event, Client, print } from 'ecstar';
import { MessageReaction, User, TextChannel, VoiceChannel } from 'discord.js';
import { emojis } from '../lib/emojis';
import { db } from '../lib/database';

const list = new Map([
  [
    'A',
    {
      ja: '雑談',
      en: 'free talk',
      emoji: '💬',
    },
  ],
  [
    'B',
    {
      ja: 'ゲーム',
      en: 'games',
      emoji: '🎮',
    },
  ],
  [
    'C',
    {
      ja: '音楽',
      en: 'music',
      emoji: '🎶',
    },
  ],
]);

export = class extends Event {
  constructor(client: Client) {
    super(client, 'messageReactionAdd');
  }
  async run(messageReaction: MessageReaction, user: User) {
    if (messageReaction.partial) {
      try {
        await messageReaction.fetch();
      } catch (error) {
        return print.error(
          `Something went wrong when fetching the message: ${error}`
        );
      }
    }

    const { channel } = messageReaction.message;

    if (user.bot) return;
    if (channel.id !== this.client.config?.channel.manager) return;

    const create = async (type: 'A' | 'B' | 'C') => {
      const channelNamePromptMessage = await channel.send(
        `${user}\n${
          list.get(type)?.ja
        }用VCを作成します。\n名前を入力してください。\n\nCreate a ${
          list.get(type)?.en
        } VC.\nPlease enter VC name.`
      );

      const channelNamePrompt = await channel
        .awaitMessages((msg) => msg.author.id === user.id, {
          max: 1,
          time: 10000,
          errors: ['time'],
        })
        .catch(() => {
          channel
            .send('おそすぎです、キャンセルしました。\nToo late, canceled.')
            .then((msg) => {
              msg.delete({ timeout: 5000 });
              channelNamePromptMessage.delete();
            });
        });

      if (!channelNamePrompt) return;

      channelNamePromptMessage.delete({ timeout: 1000 });

      const category = this.client.channels.cache.get(
        this.client.config?.category
      );

      const createdVoiceChannel = await messageReaction.message.guild?.channels.create(
        `vm ${list.get(type)?.emoji}: ${channelNamePrompt?.first()?.content}`,
        { type: 'voice', parent: category }
      );

      const inviteUrl = await createdVoiceChannel?.createInvite({
        maxAge: 86400,
      });

      const invite_msg = await (this.client.channels.cache.get(
        this.client.config?.channel.board
      ) as TextChannel).send(`${user}  ${inviteUrl?.url}`);

      db.add({
        channel_id: createdVoiceChannel?.id || '',
        channel_name: createdVoiceChannel?.name || '',
        user_id: user.id,
        user_name: user.tag,
        time: createdVoiceChannel?.createdTimestamp || 0,
        invite_msg: invite_msg.id,
      });
    };

    emojis.forEach((value, key) => {
      if (value === messageReaction.emoji.name) {
        create(key);
      }
    });

    messageReaction.users.remove(user);
  }
};
