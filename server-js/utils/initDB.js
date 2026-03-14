import pool from "./DB.js";

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      long_url TEXT NOT NULL,
      short_url VARCHAR(20) UNIQUE,
      counter INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(query);
  console.log({ level: "info", message: "Table created" });
};

createTable();
