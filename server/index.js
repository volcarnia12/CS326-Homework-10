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
        const { name, word, score} = req.query;
        const person = await self.db.createWord(name, word, score);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.post('/gameScore', async (req, res) => {
      try {
        const { name, score } = req.query;
        const person = await self.db.createGame(name, score);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/highestWordScores', async (req, res) => {
      try {
        //const { id } = req.query;
        const person = await self.db.highestWordScores();
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/highestGameScores', async (req, res) => {
      try {
        //const { id } = req.query;
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







// Create the Express app and set the port number.
/*const app = express();
const port = process.env.PORT || 8080;

// Add Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// SOLUTION BEGIN
app.use(logger('dev'));
app.use('/', express.static('client'));
// SOLUTION END


// SOLUTION BEGIN
app.post('/wordScore', async (request, response) => {
  //await database.connect();
  const { name, word, score } = request.body;
  await database.createWord(name, word, score);
  //await saveWordScore(name, word, score);
  response.status(200).json({ status: 'success' });
  //await database.close();
});

app.get('/highestWordScores', async (request, response) => {
  const scores = await top10WordScores();
  response.status(200).json(scores);
});

app.post('/gameScore', async (request, response) => {
  //await database.connect();
  const { name, score } = request.body;
  await database.createGame(name, score);
  //await saveGameScore(name, score);
  response.status(200).json({ status: 'success' });
  //await database.close();
});

app.get('/highestGameScores', async (request, response) => {
  //await database.connect();
  const scores = await top10GameScores();
  response.status(200).json(scores);
  //await database.close();
});

// This matches all routes that are not defined.
app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start the server.
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
}); */

// SOLUTION END
/** TEMPLATE BEGIN
// TODO: Implement the ExpressJS routes for this server.

// Add your code here. 😎 👍
// You can do this! Make sure you reference example applications covered in 
// class and in the associated exercises!

// This matches all routes that are not defined.
app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start the server.
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
TEMPLATE END */
