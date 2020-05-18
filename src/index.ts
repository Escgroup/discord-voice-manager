import { Client } from 'ecstar';
import LangJA from 'ecstar/dist/lang/ja';

const client = new Client({
  prefix: 'vc++',
  owner: '444754554517454848',
  lang: new LangJA(),
});

client.login(process.env.TOKEN);
