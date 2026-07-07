import app from './src/app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-bharat-ai';

const startServer = async () => {
  let dbConnected = false;
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully');
    dbConnected = true;
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Server will start in offline/mock mode:', error.message);
  }

  // Start server
  app.listen(PORT, () => {
    console.log(`
🚀 Smart Bharat AI Backend Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server:      http://localhost:${PORT}
📊 Health:      http://localhost:${PORT}/health
🔮 API:         http://localhost:${PORT}/api
🗃️  Database:    ${dbConnected ? 'MongoDB Connected' : 'Offline Mode (No database)'}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🇮🇳 Smart Bharat AI — Serving Every Indian
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Graceful shutdown...');
  await mongoose.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received. Shutting down...');
  await mongoose.disconnect();
  process.exit(0);
});

startServer();
