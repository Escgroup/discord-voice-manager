import { Event, Client, print } from 'ecstar';
import { MessageReaction, User } from 'discord.js';
import { throws } from 'assert';

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
    if (user.bot) return;
    if (
      messageReaction.message.channel.id !== this.client.config?.channel.manager
    )
      return;

    console.log(messageReaction.emoji.name);
  }
};
