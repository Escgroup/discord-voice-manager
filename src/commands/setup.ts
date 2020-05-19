import { Client, Command } from 'ecstar';
import { Message } from 'discord.js';
import { setup } from '../lib/setup';

export = class extends Command {
  constructor(client: Client) {
    super(client, { name: 'setup' });
  }
  run() {
    setup(this.client);
  }
};
