const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
    res.send('🟢 Hello from Midterm API!');
  });

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
  });