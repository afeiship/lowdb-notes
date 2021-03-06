const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const shortid = require('shortid');

// Create server
const app = express();
app.use(bodyParser.json());

// Create database instance and start server
const adapter = new FileAsync('./src/db.json');

low(adapter)
  .then((db) => {
    // Routes

    // GET /posts/:id
    app.get('/posts/:id', (req, res) => {
      const post = db.get('posts').find({ id: req.params.id }).value();

      res.send(post);
    });

    // POST /posts
    app.post('/posts', (req, res) => {
      db.get('posts')
        .push(req.body)
        .last()
        .assign({ id: shortid() })
        .write()
        .then((post) => res.send(post));
    });

    // POST /posts
    app.post('/posts/reset', (req, res) => {
      db.set('posts', []).write();
      res.send(db.get('posts'));
    });

    // Set db default values
    return db.defaults({ posts: [] }).write();
  })
  .then(() => {
    app.listen(5000, () => console.log('App running.'));
  });
