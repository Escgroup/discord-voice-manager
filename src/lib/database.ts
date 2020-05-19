import { Snowflake } from 'discord.js';
import { promises as fs } from 'fs';

type dataType = {
  channel_id: Snowflake;
  channel_name: string;
  user_id: Snowflake;
  user_name: string;
  time: number;
  invite_msg: Snowflake;
};

class database {
  public path = `${__dirname}/db.json`;
  constructor() {}
  async add(item: dataType) {
    const file = await this.getFile();
    file.push(item);
    this.save(file);
  }
  async getFile() {
    const file: [dataType] = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    return file;
  }
  save(item: [dataType]) {
    fs.writeFile(this.path, JSON.stringify(item));
  }
}

export const db = new database();
