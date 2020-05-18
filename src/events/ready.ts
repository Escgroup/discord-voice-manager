import { Event, Client } from 'ecstar';

export = class extends Event {
  constructor(client: Client) {
    super(client, 'ready');
  }
  run() {
    this.client.user?.setActivity('通話管理Bot');
    // setup(client, config);
    // setInterval(() => check(client, config), 60000);
  }
};
