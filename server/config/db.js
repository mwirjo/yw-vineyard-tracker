const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbInstance;

/**
 * Initializes and caches the database connection (Singleton Pattern).
 */
const connectDB = async () => {
  if (dbInstance) return dbInstance;

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('MongoDB Connected Successfully');
    dbInstance = client.db();
    return dbInstance;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1); // Stop server on connection failure
  }
};

/**
 * Returns the cached database instance.
 */
const getDB = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return dbInstance;
};

module.exports = { 
  connectDB, 
  getDB,
  getDb: getDB // Alias to prevent case-sensitivity errors
};