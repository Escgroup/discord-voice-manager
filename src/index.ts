import { Client } from 'ecstar';
import LangJA from 'ecstar/dist/lang/ja';

const client = new Client({
  partials: ['MESSAGE', 'REACTION'],
  prefix: 'vc+',
  owner: '444754554517454848',
  lang: new LangJA(),
  config: {
    channel: { manager: '638565348563484682', board: '638643143469694977' },
  },
});

client.login(process.env.TOKEN);
