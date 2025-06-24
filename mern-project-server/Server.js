require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_ENDPOINT,
  credentials: true,
}));

app.use('/auth', authRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
