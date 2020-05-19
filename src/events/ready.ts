import { Event, Client } from 'ecstar';
import { check } from '../lib/check';

export = class extends Event {
  constructor(client: Client) {
    super(client, 'ready');
  }
  run() {
    this.client.user?.setActivity('通話管理Bot');

    setInterval(() => check(this.client), 15000);
  }
};
