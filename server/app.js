require('dotenv').config(".env")
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');

const globalErrorHandler = require('./controllers/error.controller');
const authRouter = require('./routers/auth.router');
const laptopRouter = require('./routers/laptop.router');
const oauthRouter = require('./routers/oauth.router');

const app = express()

// app.use(helmet())
// app.use(sanitize())
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

app.get("/api/status", (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' });
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())

//routers
app.use("/api/auth", authRouter)
app.use("/api/laptops", laptopRouter)
app.use("/api/oauth", oauthRouter)

app.use(globalErrorHandler)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    })
  })