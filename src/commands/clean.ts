import { Client, Command } from 'ecstar';
import { Message } from 'discord.js';

export = class extends Command {
  constructor(client: Client) {
    super(client, { name: 'clean', ownerOnly: true });
  }
  run(message: Message) {
    message.channel.bulkDelete(99);
  }
};
