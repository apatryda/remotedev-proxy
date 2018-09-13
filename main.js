#! /usr/bin/env node
const Remotedev = require('remotedev');
const RemotedevServer = require('remotedev-server');
const express = require('express');
const app = express();

RemotedevServer({ port: 8000 }).then(sc => sc.on('ready', () => {
  const remotedev = Remotedev.connect({ hostname: 'localhost', port: 8000 });
  app
    .use(express.json({
      limit: '16mb',
    }))
    .post('/init', (req, res, next) => {
      const { action, state } = req.body;

      remotedev.init(state, action);
      res.status(204).send();
    })
    .post('/state', (req, res, next) => {
      const { state } = req.body;

      if (!state) {
        res.status(400).json({ error: 'state not present' });
        return;
      }

      remotedev.send(undefined, state);
      res.status(204).send();
    })
    .post('/action', (req, res, next) => {
      const { action, state } = req.body;

      if (!action) {
        res.status(400).json({ error: 'action not present' });
        return;
      }

      remotedev.send(action, state);
      res.status(204).send();
    })
    .listen(7999)
  ;
}));
