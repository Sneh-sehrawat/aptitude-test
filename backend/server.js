
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');




// ROUTES (All CommonJS style)
const questionRoutes = require('./routes/questionRoutes');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');  // ✅ FIXED: CommonJS require
const testRoutes = require('./routes/test');

const app = express();

// CORS Middleware
app.use(cors({
  origin: ["https://react.edvancecube.com"],
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON Body Parser Middleware
app.use(express.json());

// ROUTES MOUNTING
           // Example: /api/submit
           

app.use('/api/auth', authRoutes);         // Example: /api/auth/login
app.use('/api/questions', questionRoutes);// Example: /api/questions/fetch
app.use('/api/admin', adminRoutes);  
app.use('/api', testRoutes);   
app.use("/api/gemini", require("./routes/gemini"));    
 

// DATABASE CONNECTION & SERVER START
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(5050, () => console.log('🚀 Server running on port 5050'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));