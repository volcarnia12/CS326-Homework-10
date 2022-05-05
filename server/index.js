// import * as http from 'http';
// import * as url from 'url';
// import { readFile, writeFile } from 'fs/promises';
//require('dotenv').config();
import express from 'express';
import { readFile, writeFile } from 'fs/promises';
// SOLUTION BEGIN
import logger from 'morgan';
import 'dotenv/config';
import { ScrabbleDatabase } from './wordDatabase.js';
// SOLUTION END
/** TEMPLATE BEGIN
TODO: import the morgan middleware from 'morgan'
TEMPLATE END */


class ScrabbleServer {
  constructor(dburl) {
    this.dburl = dburl;
    this.app = express();
    this.app.use('/', express.static('client'));
  }

  async initRoutes() {
    // Note: when using arrow functions, the "this" binding is lost.
    const self = this;

    this.app.post('/wordScore', async (req, res) => {
      try {
        const { player, word, score} = req.query;
        const person = await self.db.createWord(player, word, score);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.post('/gameScore', async (req, res) => {
      try {
        const { player, score } = req.query;
        const person = await self.db.createGame(player, score);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/highestWordScores', async (req, res) => {
      try {
        const person = await self.db.highestWordScores();
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/highestGameScores', async (req, res) => {
      try {
        const person = await self.db.highestGameScores();
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });

  }

  async initDb() {
    this.db = new ScrabbleDatabase(this.dburl);
    await this.db.connect();
  }

  async start() {
    await this.initRoutes();
    await this.initDb();
    const port = process.env.PORT || 8080;
    this.app.listen(port, () => {
      console.log(`PeopleServer listening on port ${port}!`);
    });
  }
}

const server = new ScrabbleServer(process.env.DATABASE_URL);
server.start();

