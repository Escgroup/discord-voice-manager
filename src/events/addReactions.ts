import { Event, Client, print } from 'ecstar';
import { MessageReaction, User, TextChannel } from 'discord.js';
import { emojis } from '../lib/emojis';

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
      channel.send(
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
          channel.send(
            'おそすぎです、キャンセルしました。\nToo late, canceled.'
          );
        });

      if (!channelNamePrompt) return;

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

      (this.client.channels.cache.get(
        this.client.config?.channel.board
      ) as TextChannel).send(`${user}  ${inviteUrl?.url}`);
    };

    emojis.forEach((value, key) => {
      if (value === messageReaction.emoji.name) {
        create(key);
      }
    });
  }
};
