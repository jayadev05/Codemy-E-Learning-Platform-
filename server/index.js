const express = require("express");
const userRoute = require('./routes/user/userRoutes'); // Adjust the path if necessary
const app = express();
const cors=require('cors')
const mongoose = require('mongoose')
const cookieParser=require('cookie-parser')

// Database Connection
mongoose.connect("mongodb://localhost:27017/Codemy")
  .then(() => {
    console.log(`MongoDB connected successfully to ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

  // Security Headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'"
  );
  next();
});

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use("/user", userRoute); // Register user routes

app.get('/test', (req, res) => {
  res.send({ message: "Server with routes is working!" });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
