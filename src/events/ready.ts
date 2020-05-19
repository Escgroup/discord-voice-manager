import { Event, Client } from 'ecstar';
import { setup } from '../lib/setup';

export = class extends Event {
  constructor(client: Client) {
    super(client, 'ready');
  }
  run() {
    this.client.user?.setActivity('通話管理Bot');
    setup(this.client);
    // setInterval(() => check(client, config), 60000);
  }
};
