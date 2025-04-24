 // Dummy change to trigger PR from release/v1.0 to main
const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;


app.get('/db', async (req, res) => {
    const pool = new Pool({  
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false }
    });
    try {
      const { rows } = await pool.query('SELECT NOW()');
      res.send(`🟢 DB OK: ${rows[0].now}`);
    } catch (e) {
      res.status(500).send(`🔴 DB Error: ${e.message}`);
    } finally {
      await pool.end();
    }
  });

  

app.get('/hello', (req, res) => {
    res.send('🟢 Hello from Midterm API!');
  });


app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
  });