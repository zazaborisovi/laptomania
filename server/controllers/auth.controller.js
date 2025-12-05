const User = require("../models/user.model")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const sendEmail = require("../utils/email")

const createSendToken = (user , statusCode , res) =>{
  const token = user.signToken()
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV == "prod",
    sameSite: "strict",
    maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  }
  res.cookie("lg" , token, cookieOptions)
  res.status(statusCode).json(user)
}

const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body
  const user = await User.create({ name, email, password })
  
  const code = user.createEmailVerificationToken()
  await user.save({ validateBeforeSave: false })
  
  const verificationUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/verify/${code}`
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #3b82f6 100%);
          padding: 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          max-width: 600px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(14, 165, 233, 0.3);
          overflow: hidden;
          border: 2px solid rgba(14, 165, 233, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -5%;
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }
        .header p {
          font-size: 16px;
          opacity: 0.95;
          position: relative;
          z-index: 1;
        }
        .content {
          padding: 40px 30px;
          background: linear-gradient(to bottom, #ffffff 0%, #f0f9ff 100%);
        }
        .welcome-text {
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .message {
          font-size: 15px;
          color: #475569;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        .button-container {
          text-align: center;
          margin: 35px 0;
        }
        .verify-button {
          display: inline-block;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          color: white;
          text-decoration: none;
          padding: 16px 48px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .verify-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(14, 165, 233, 0.5);
        }
        .divider {
          margin: 30px 0;
          text-align: center;
          position: relative;
        }
        .divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, #cbd5e1, transparent);
        }
        .divider span {
          background: white;
          padding: 0 15px;
          color: #94a3b8;
          font-size: 14px;
          position: relative;
          z-index: 1;
        }
        .alternative-link {
          background: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          word-break: break-all;
          font-size: 13px;
          color: #0ea5e9;
          border: 1px solid #bae6fd;
        }
        .footer {
          background: linear-gradient(to bottom, #f8fafc 0%, #e0f2fe 100%);
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #bae6fd;
        }
        .footer p {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }
        .icon {
          font-size: 64px;
          margin-bottom: 15px;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          margin-top: 10px;
          backdrop-filter: blur(10px);
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
          }
          .header h1 {
            font-size: 24px;
          }
          .content {
            padding: 30px 20px;
          }
          .verify-button {
            padding: 14px 36px;
            font-size: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">💻</div>
          <h1>Welcome to Laptomania!</h1>
          <p>Just one more step to get started</p>
          <div class="tech-badge">
            <span>🖥️</span>
            <span>Your Tech Journey Begins</span>
          </div>
        </div>
        
        <div class="content">
          <p class="welcome-text">Hi <strong>${user.name}</strong>, 👋</p>
          
          <p class="message">
            Thank you for registering with Laptomania! We're excited to have you on board. 
            To complete your registration and start exploring our amazing collection of laptops 💻, 
            please verify your email address by clicking the button below.
          </p>
          
          <div class="button-container">
            <a href="${verificationUrl}" class="verify-button">🔐 Verify Email Address</a>
          </div>
          
          <div class="divider">
            <span>OR</span>
          </div>
          
          <p class="message" style="margin-bottom: 10px; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          
          <div class="alternative-link">
            ${verificationUrl}
          </div>
          
          <p class="message" style="margin-top: 25px; font-size: 14px; color: #64748b;">
            ⏱️ This verification link will expire in 24 hours for security reasons.
          </p>
        </div>
        
        <div class="footer">
          <p>
            If you didn't create an account with Laptomania, please ignore this email.
          </p>
          <p style="margin-top: 10px;">
            💻 © ${new Date().getFullYear()} Laptomania. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
  
  try{
    await sendEmail({
      to: user.email,
      subject: "verify your email",
      html
    })
    res.status(200).json("User created succesfully check your email to verify your account")
  }catch(err){
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(new AppError("there was an error sending email", 500))
  }

})

const verify = catchAsync(async (req , res , next) =>{
  const {code} = req.params
  
  const user = await User.findOne({verificationCode: code})
  
  user.isVerified = true
  user.verificationCode = undefined
  
  await user.save({ validateBeforeSave: false })
  res.status(200).json("email verified")
})

const login = catchAsync( async (req , res , next) =>{
  const {email , password} = req.body
  
  const user = await User.findOne({email}).select("+password")
  if (!user){
    return next(new AppError("invalid email or password", 401))
  }
  
  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect){
    return next(new AppError("invalid email or password", 401))
  }
  
  createSendToken(user , 200 , res)
})

const logout = catchAsync(async (req , res) =>{
  res.clearCookie("lg")
  res.status(200).send()
})

module.exports = {register , verify , login , logout , createSendToken}