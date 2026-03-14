import pool from "../utils/DB.js";

export const insertLongUrl = async (longUrl) => {
    const query = `
        INSERT INTO urls (long_url)
        VALUES ($1)
        RETURNING id;
    `;
    const values = [longUrl];
    const { rows } = await pool.query(query, values);
    return rows[0].id;
};

export const updateShortUrl = async (id, shortUrl) => {
    const query = `
        UPDATE urls
        SET short_url = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
    `;
    const values = [shortUrl, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const getUrlByShortUrl = async (shortUrl) => {
    const query = `
        SELECT * FROM urls
        WHERE short_url = $1;
    `;
    const values = [shortUrl];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const incrementCounter = async (id) => {
    const query = `
        UPDATE urls
        SET counter = counter + 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *;
    `;
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const getAllUrls = async () => {
    const query = `
        SELECT * FROM urls
        ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
};