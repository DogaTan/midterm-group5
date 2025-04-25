const express = require("express");
const { Pool } = require("pg");
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// 1. Key Vault URL .env veya Azure App Settings içinde tanımlı olmalı
const keyVaultUrl = process.env.KEYVAULTURL;

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(keyVaultUrl, credential);

app.get("/db", async (req, res) => {
  try {
    // 2. Azure Key Vault üzerinden Secret değerlerini al
    const dbHost = (await secretClient.getSecret("DB-HOST")).value;
    const dbUser = (await secretClient.getSecret("DB-USER")).value;
    const dbPass = (await secretClient.getSecret("DB-PASSWORD")).value;
    const dbName = (await secretClient.getSecret("DB-NAME")).value;

    // 3. PostgreSQL bağlantısı
    const pool = new Pool({
      host: dbHost,
      user: dbUser,
      password: dbPass,
      database: dbName,
      port: 5432,
      ssl: { rejectUnauthorized: false }
    });

    // 4. Sorgu gönder
    const { rows } = await pool.query("SELECT '🟢 Hello from Azure PostgreSQL via Key Vault!' AS message");
    res.send(rows[0].message);
    
    await pool.end();
  } catch (error) {
    console.error("❌ DB bağlantı hatası:", error);
    res.status(500).send(`🔴 DB Error: ${error.message}`);
  }
});

app.get("/hello", (req, res) => {
  res.send("🟢 Hello from Midterm API!");
});

app.listen(port, () => {
  console.log(`🚀 App running at http://localhost:${port}`);
});
