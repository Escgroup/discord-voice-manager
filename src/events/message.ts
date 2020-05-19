import { Event, Client } from 'ecstar';
import { Message } from 'discord.js';

export = class extends Event {
  constructor(client: Client) {
    super(client, 'message');
  }
  run(message: Message) {
    if (
      message.channel.id === this.client.config?.channel.manager &&
      message.author.id !== this.client.user?.id
    )
      message.delete({ timeout: 1000 });
  }
};
