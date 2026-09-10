const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbInstance;

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
    process.exit(1);
  }
};

const getDB = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return dbInstance;
};

module.exports = { connectDB, getDB };