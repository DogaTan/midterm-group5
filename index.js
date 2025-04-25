require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const app = express();
const port = process.env.PORT || 3000;

// 🔐 Azure Key Vault bağlantısı
const keyVaultUrl = process.env.KEYVAULT_URL;
const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(keyVaultUrl, credential);

// 🟢 Test amaçlı endpoint
app.get("/hello", (req, res) => {
  res.send("🟢 Hello from Midterm API!");
});

// 🗄️ DB bağlantısı ve secret çekme
app.get("/db", async (req, res) => {
  try {
    // 1. SecretClient üzerinden şifreyi al
    const { value: dbPassword } = await secretClient.getSecret("DB-PASSWORD");

    // 2. PostgreSQL bağlantısını oluştur
    const pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: dbPassword,
      port: Number(process.env.DB_PORT),
      ssl: { rejectUnauthorized: false },
    });

    // 3. Test sorgusu gönder
    const { rows } = await pool.query("SELECT NOW()");
    res.send(`🟢 DB OK: ${rows[0].now}`);

    await pool.end();
  } catch (err) {
    console.error("🔴 DB connection error:", err.message);
    res.status(500).send(`🔴 DB Error: ${err.message}`);
  }
});

// 🌐 Sunucuyu başlat
app.listen(port, () => {
  console.log(`🚀 App listening on port ${port}`);
});
