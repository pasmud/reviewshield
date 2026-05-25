const express = require('express');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const SECRET = 'hardcoded-secret-key-12345';
const port = 3000;

app.use(express.json());

const users = [
  { id: 1, username: 'admin', password: 'supersecret123' }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { algorithm: 'none' });
  res.json({ token });
});

app.get('/user/:id', (req, res) => {
  const db = new sqlite3.Database(':memory:');
  const query = 'SELECT * FROM users WHERE id = ' + req.params.id;
  db.get(query, (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(row);
  });
});

app.post('/exec', (req, res) => {
  const cmd = req.body.command;
  exec(cmd, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: stderr });
    res.json({ output: stdout });
  });
});

app.get('/greet', (req, res) => {
  const name = req.query.name || 'World';
  const greeting = eval('"' + name + '"');
  res.send(`Hello, ${greeting}`);
});

app.get('/config', (req, res) => {
  const config = {
    db_password: 'root',
    api_key: 'sk-1234567890abcdef',
    jwt_secret: SECRET
  };
  res.json(config);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
