const express = require('express');

const Users = require('./users/users-model')

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({ api: "up" });
  });

server.get('/users', (req, res) => {
    Users.getAll()
        .then(users => {
            res.status(200).json(users)
        }).catch(err => {
            res.status(500).json(err)
        })
})

server.get("/users/:id", (req, res) => {
    Users.getById(req.params.id)
      .then(user => {
        res.status(200).json(user)
      });
  });

  server.post("/users", (req, res) => {
    Users.insert(req.body)
      .then(user => {
        res.status(201).json(user)
      });
  });
  
  server.delete("/users/:id", (req, res) => {
    Users.remove(req.params.id)
      .then(user => {
        res.json(user)
      });
  });
  
  server.put("/users/:id", (req, res) => {
    Users.update(req.params.id, req.body)
      .then(user => {
        res.json(user)
      });
  });

module.exports = server;