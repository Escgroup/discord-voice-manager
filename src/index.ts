import { Client } from 'ecstar';
import LangJA from 'ecstar/dist/lang/ja';

const client = new Client({
  partials: ['MESSAGE', 'REACTION'],
  prefix: 'vc+',
  owner: '444754554517454848',
  lang: new LangJA(),
  config: {
    channel: { manager: '638565348563484682', board: '712186624540409916' },
    category: '443329504715472899',
  },
});

client.login(process.env.TOKEN);
