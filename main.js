const Remotedev = require('remotedev');
const RemotedevServer = require('remotedev-server');
const express = require('express');
const app = express();

RemotedevServer({ hostname: 'localhost', port: 8000 }).then(sc => sc.on('ready', () => {
  const remotedev = Remotedev.connect({ hostname: 'localhost', port: 8000 });
  app
    .use(express.json())
    .post('/init', (req, res, next) => {
      const { state } = req.body;

      if (!state) {
        res.status(400).json({ error: 'state not present' });
        return;
      }

      remotedev.init(state);
      res.status(200).json({});
    })
    .post('/state', (req, res, next) => {
      const { state } = req.body;

      if (!state) {
        res.status(400).json({ error: 'state not present' });
        return;
      }

      remotedev.send(undefined, state);
      res.status(200).json({});
    })
    .post('/action', (req, res, next) => {
      const { action, state } = req.body;

      if (!state) {
        res.status(400).json({ error: 'action or state not present' });
        return;
      }

      remotedev.send(action, state);
      res.status(200).json({});
    })
    .listen(7999)
  ;
}));
