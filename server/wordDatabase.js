import 'dotenv/config';
import pg from 'pg';

// Get the Pool class from the pg module.
const { Pool } = pg;

export class ScrabbleDatabase {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    // Create a new Pool. The Pool manages a set of connections to the database.
    // It will keep track of unused connections, and reuse them when new queries
    // are needed. The constructor requires a database URL to make the
    // connection. You can find the URL of your database by looking in Heroku
    // or you can run the following command in your terminal:
    //
    //  heroku pg:credentials:url -a APP_NAME
    //
    // Replace APP_NAME with the name of your app in Heroku.
    this.pool = new Pool({
      connectionString: this.dburl,
      ssl: { rejectUnauthorized: false }, // Required for Heroku connections
    });

    // Create the pool.
    this.client = await this.pool.connect();

    // Init the database.
    await this.init();
  }

  async init() {
    const queryText = `
      create table if not exists word (
        player varchar(30),
        word varchar(30),
        score integer
      );
    
      create table if not exists game (
        player varchar(30),
        score integer
      );
    `;
    const res = await this.client.query(queryText);
    //const res2 = await this.client.query(queryText2);
  }

  // Close the pool.
  async close() {
    this.client.release();
    await this.pool.end();
  }

  // CREATE a user in the database.
  async createWord(player, word, score) {
    const queryText =
      'INSERT INTO word (player,word,score) VALUES ($1, $2, $3) RETURNING *';
    const res = await this.client.query(queryText, [player,word,score]);
    return res.rows;
  }

  async createGame(player, score) {
    const queryText =
      'INSERT INTO game (player,score) VALUES ($1, $2) RETURNING *';
    const res = await this.client.query(queryText, [player,score]);
    return res.rows;
  }

  // READ a user from the database.
  async readWord(player) {
    const queryText = 'SELECT * FROM word WHERE player = $1';
    const res = await this.client.query(queryText, [player]);
    return res.rows;
  }

  async readGame(player) {
    const queryText = 'SELECT * FROM game WHERE player = $1';
    const res = await this.client.query(queryText, [player]);
    return res.rows;
  }

  // UPDATE a user in the database.
  async updateWord(player, word, score) {
    const queryText =
      'UPDATE word SET word = $2, score = $3 WHERE player = $1 RETURNING *';
    const res = await this.client.query(queryText, [player, word, score]);
    return res.rows;
  }

  async updateGame(player, score) {
    const queryText =
      'UPDATE game SET score = $2 WHERE player = $1 RETURNING *';
    const res = await this.client.query(queryText, [player, score]);
    return res.rows;
  }

  // DELETE a user from the database.
  async deleteWord(player) {
    const queryText = 'DELETE FROM word WHERE player = $1 RETURNING *';
    const res = await this.client.query(queryText, [player]);
    return res.rows;
  }

  async deleteGame(player) {
    const queryText = 'DELETE FROM game WHERE player = $1 RETURNING *';
    const res = await this.client.query(queryText, [player]);
    return res.rows;
  }


  // READ all people from the database.
  async readAllWords() {
    const queryText = 'SELECT * FROM word';
    const res = await this.client.query(queryText);
    return res.rows;
  }

  async readAllGames() {
    const queryText = 'SELECT * FROM game';
    const res = await this.client.query(queryText);
    return res.rows;
  }
}