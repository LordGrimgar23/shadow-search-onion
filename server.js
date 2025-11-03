const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Route: Search (merges external API and DB)
app.get("/search", async (req, res) => {
  const query = req.query.q || "";
  try {
    const dbResults = await db.query(
      `SELECT name, url, description FROM onions WHERE name ILIKE $1 OR description ILIKE $1`,
      [`%${query}%`]
    );

    const ahmiaResults = await axios.get(
      `https://ahmia.fi/search/?q=${encodeURIComponent(query)}`
    );

    res.json({
      database: dbResults.rows,
      external: ahmiaResults.data.results || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
});

// Route: Add new Onion URL
app.post("/add", async (req, res) => {
  const { name, url, description } = req.body;
  if (!name || !url || !description || !url.endsWith(".onion")) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    await db.query(
      "INSERT INTO onions (name, url, description, added_at) VALUES ($1, $2, $3, NOW())",
      [name, url, description]
    );
    res.json({ message: "Onion URL added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add URL" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Shadow Search running on port ${PORT}`));
