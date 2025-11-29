
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');





const questionRoutes = require('./routes/questionRoutes');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');  
const testRoutes = require('./routes/test');

const app = express();


app.use(cors({
  origin: ["https://cleartest.thecertiedge.com","http://localhost:5173", "https://react.edvancecube.com","https://test.edvancecube.com"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());


           

app.use('/api/auth', authRoutes);         
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);  
app.use('/api', testRoutes);   
app.use("/api/gemini", require("./routes/gemini")); 

app.get('/health', (req, res) => {
  res.status(200).send('Server is alive!');
});

 


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(5050, () => console.log('🚀 Server running on port 5050'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));