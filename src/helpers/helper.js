import dotenv from "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false, 
  },
});

const connectToDatabase = async () => {
  try {
    console.log("Connecting to Postgres...");
    const client = await pool.connect();
    client.release();
    console.log("Connected to NEON");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary,  connectToDatabase };
