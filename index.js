 // Dummy change to trigger PR from release/v1.0 to main
const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
  });