import { Client } from "pg";

const client = new Client({
  user: "postgres", // Replace with your PostgreSQL username
  password: "postgres", // Replace with your PostgreSQL password
  host: "localhost", // Replace with your PostgreSQL host
  database: "bakery-inventory", // Replace with your PostgreSQL database name
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Error connecting to PostgreSQL", err));

export const Database = {
  query: async <T>(sql: string, params?: any[]): Promise<T[]> => {
    const result = await client.query(sql, params);
    return result.rows;
  },
};
