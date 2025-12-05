const express = require('express');

// authentication controllers
const {register , verify , login , logout} = require('../controllers/auth.controller')
const protect = require('../middlewares/auth.middleware')

const authRouter = express.Router();

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)

authRouter.get("/verify/:code" , verify)

authRouter.post("/auto-login", protect , async(req , res , next)=>{
  res.status(200).json(req.user)
})

module.exports = authRouter;