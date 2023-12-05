// src/index.ts
import express from 'express';

const app = express();
const port = 5052;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript and Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
