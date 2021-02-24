const express = require('express');

const app = express();

app.get('/status/200', (req, res) => {
  res.status(200).end();
});

app.get('/status/404', (req, res) => {
  res.status(404).end();
});

app.get('/status/301', (req, res) => {
  res.redirect(301, '/redirected');
});

app.get('/redirected', (req, res) => {
  res.status(200).end();
});

app.get('/auth', (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  const auth = {
    user: 'user',
    password: 'password',
  };

  const [, base64Str] = req.headers.authorization.split(' ');

  const [user, password] = Buffer.from(base64Str, 'base64')
    .toString()
    .split(':');

  if (auth.user !== user || auth.password !== password) {
    return res.status(401).end();
  }

  return res.status(200).end();
});

app.get('/timeout', (req, res) => {
  res.setTimeout(500, () => {
    res.status(200).end();
  });
});

module.exports = app;
