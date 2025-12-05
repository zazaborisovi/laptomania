# Security Suggestions for Laptomania Server

## 🔴 Critical Security Issues

### 1. **Exposed Sensitive Credentials in .env File**
**Risk Level:** CRITICAL

**Issue:** The `.env` file contains hardcoded sensitive credentials that should NEVER be committed to version control:
- MongoDB connection string with username and password
- Cloudinary API credentials
- JWT secret key
- Email credentials

**Recommendations:**
- Add `.env` to `.gitignore` immediately
- Rotate all exposed credentials (MongoDB password, Cloudinary API keys, JWT secret)
- Use environment-specific `.env` files (`.env.development`, `.env.production`)
- Consider using a secrets management service (AWS Secrets Manager, HashiCorp Vault, etc.)
- Document required environment variables in a `.env.example` file without actual values

### 2. **Weak Rate Limiting Configuration**
**Risk Level:** HIGH

**Issue:** Current rate limiter allows only 5 requests per 15 minutes globally, which is too restrictive and applies to ALL routes including static endpoints.

**Current Code:**
```javascript
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again later.'
}));
```

**Recommendations:**
- Apply different rate limits for different routes:
  - Authentication routes: 5-10 requests per 15 minutes
  - API routes: 100-1000 requests per 15 minutes
  - Public routes: Higher limits
- Use `express-rate-limit` with Redis for distributed systems
- Implement progressive delays instead of hard blocks

**Example:**
```javascript
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts, please try again later.'
});

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);
```

### 3. **Missing Input Validation and Sanitization**
**Risk Level:** HIGH

**Issue:** No input validation/sanitization for user inputs, making the application vulnerable to:
- NoSQL Injection
- XSS attacks
- Data integrity issues

**Recommendations:**
- Install and use `express-mongo-sanitize` to prevent NoSQL injection
- Install and use `xss-clean` to sanitize user input
- Install and use `express-validator` for comprehensive input validation
- Validate all request bodies, params, and query strings

**Example:**
```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const { body, validationResult } = require('express-validator');

app.use(mongoSanitize());
app.use(xss());

// In auth.controller.js
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  body('name').trim().isLength({ min: 2, max: 50 }).escape()
];
```

### 4. **Missing HTTPS Enforcement**
**Risk Level:** HIGH

**Issue:** No HTTPS enforcement in production, cookies can be intercepted.

**Recommendations:**
- Use `helmet` middleware for security headers
- Enforce HTTPS in production
- Set secure cookie flags properly

**Example:**
```javascript
const helmet = require('helmet');
app.use(helmet());

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## 🟠 High Priority Security Issues

### 5. **Weak Password Policy**
**Risk Level:** HIGH

**Issue:** Password only requires 8 characters minimum with no complexity requirements.

**Current Code:**
```javascript
password: {
  type: String,
  required: [true, "Password is required"],
  minlength: [8, "Password must be at least 8 characters"],
  select: false
}
```

**Recommendations:**
- Require password complexity (uppercase, lowercase, numbers, special characters)
- Implement password strength meter on frontend
- Add password history to prevent reuse
- Consider using `zxcvbn` for password strength estimation

**Example:**
```javascript
password: {
  type: String,
  required: [true, "Password is required"],
  minlength: [12, "Password must be at least 12 characters"],
  validate: {
    validator: function(v) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v);
    },
    message: 'Password must contain uppercase, lowercase, number and special character'
  },
  select: false
}
```

### 6. **Missing JWT Token Expiration Validation**
**Risk Level:** HIGH

**Issue:** No check for token expiration or token revocation mechanism.

**Recommendations:**
- Implement token refresh mechanism
- Add token blacklist for logout
- Check if user changed password after token was issued
- Store `passwordChangedAt` field in user model

**Example:**
```javascript
// In user.model.js
UserSchema.add({
  passwordChangedAt: Date
});

UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// In auth.middleware.js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id);

if (user.changedPasswordAfter(decoded.iat)) {
  return next(new AppError('User recently changed password! Please log in again.', 401));
}
```

### 7. **Email Verification Token Not Hashed**
**Risk Level:** HIGH

**Issue:** Email verification tokens are stored in plain text in the database.

**Current Code:**
```javascript
UserSchema.methods.createEmailVerificationToken = function (){
  const code = crypto.randomBytes(16).toString("hex")
  this.verificationCode = code
  return code
}
```

**Recommendations:**
- Hash the verification token before storing
- Add expiration time for verification tokens
- Use cryptographically secure random tokens

**Example:**
```javascript
UserSchema.methods.createEmailVerificationToken = function() {
  const code = crypto.randomBytes(32).toString("hex");
  this.verificationCode = crypto.createHash('sha256').update(code).digest('hex');
  this.verificationCodeExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return code; // Return unhashed version to send via email
};

// In verify controller
const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
const user = await User.findOne({
  verificationCode: hashedCode,
  verificationCodeExpires: { $gt: Date.now() }
});
```

### 8. **Missing File Upload Security**
**Risk Level:** HIGH

**Issue:** No file type validation, size limits, or malware scanning for uploaded images.

**Current Code:**
```javascript
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
```

**Recommendations:**
- Validate file types (MIME type and extension)
- Set file size limits
- Sanitize filenames
- Scan for malware
- Use a separate domain for user uploads

**Example:**
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, PNG and WebP are allowed', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 4
  }
});
```

### 9. **CORS Configuration Too Permissive**
**Risk Level:** MEDIUM-HIGH

**Issue:** CORS is configured for a single origin but credentials are enabled.

**Current Code:**
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

**Recommendations:**
- Use environment variables for allowed origins
- Implement dynamic origin validation for multiple environments
- Add OPTIONS preflight handling

**Example:**
```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🟡 Medium Priority Security Issues

### 10. **Missing Request Body Size Limits**
**Risk Level:** MEDIUM

**Issue:** No limits on request body size, vulnerable to DoS attacks.

**Recommendations:**
```javascript
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

### 11. **Missing Security Headers**
**Risk Level:** MEDIUM

**Issue:** No security headers configured (CSP, HSTS, X-Frame-Options, etc.).

**Recommendations:**
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 12. **Missing MongoDB Connection Error Handling**
**Risk Level:** MEDIUM

**Issue:** No error handling for MongoDB connection failures.

**Recommendations:**
```javascript
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
```

### 13. **Missing Account Lockout Mechanism**
**Risk Level:** MEDIUM

**Issue:** No protection against brute force attacks on login.

**Recommendations:**
- Implement account lockout after failed login attempts
- Add progressive delays
- Send email notifications for suspicious activity

**Example:**
```javascript
// Add to user model
UserSchema.add({
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
});

UserSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.lockUntil) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};
```

### 14. **Missing Logging and Monitoring**
**Risk Level:** MEDIUM

**Issue:** No logging for security events, errors, or suspicious activities.

**Recommendations:**
- Implement structured logging with `winston` or `pino`
- Log authentication attempts, failures, and successes
- Log all errors with context
- Set up monitoring and alerting

**Example:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log failed login attempts
logger.warn('Failed login attempt', {
  email: email,
  ip: req.ip,
  timestamp: new Date()
});
```

### 15. **Missing Parameter Pollution Protection**
**Risk Level:** MEDIUM

**Issue:** Vulnerable to HTTP Parameter Pollution attacks.

**Recommendations:**
```javascript
const hpp = require('hpp');

app.use(hpp({
  whitelist: ['price', 'brand', 'processor'] // Allow duplicates for these params
}));
```

---

## 🟢 Low Priority Security Improvements

### 16. **Environment Variable Validation**
**Risk Level:** LOW

**Recommendations:**
- Validate all required environment variables on startup
- Use a library like `envalid` or `joi`

**Example:**
```javascript
const envalid = require('envalid');

const env = envalid.cleanEnv(process.env, {
  MONGODB_URI: envalid.str(),
  JWT_SECRET: envalid.str({ minLength: 32 }),
  NODE_ENV: envalid.str({ choices: ['dev', 'prod', 'test'] }),
  CLOUDINARY_CLOUD_NAME: envalid.str(),
  CLOUDINARY_API_KEY: envalid.str(),
  CLOUDINARY_API_SECRET: envalid.str()
});
```

### 17. **Add API Versioning**
**Risk Level:** LOW

**Recommendations:**
```javascript
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/laptops", laptopRouter);
```

### 18. **Implement Graceful Shutdown**
**Risk Level:** LOW

**Recommendations:**
```javascript
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});
```

### 19. **Add Request ID for Tracing**
**Risk Level:** LOW

**Recommendations:**
```javascript
const { v4: uuidv4 } = require('uuid');

app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
});
```

### 20. **Implement Content Security Policy**
**Risk Level:** LOW

**Recommendations:**
- Already covered in helmet configuration above
- Regularly review and update CSP directives

---

## 📋 Additional Security Best Practices

### 21. **Database Security**
- Enable MongoDB authentication
- Use connection string with SSL/TLS
- Implement database-level encryption
- Regular backups with encryption
- Principle of least privilege for database users

### 22. **Dependency Security**
- Run `npm audit` regularly
- Use `npm audit fix` to update vulnerable packages
- Consider using `snyk` or `dependabot` for automated security updates
- Keep all dependencies up to date

### 23. **Code Security**
- Implement code reviews
- Use static analysis tools (ESLint with security plugins)
- Regular security audits
- Penetration testing

### 24. **Session Management**
- Implement session timeout
- Regenerate session IDs after login
- Implement "remember me" functionality securely
- Add multi-factor authentication (MFA)

### 25. **Data Protection**
- Implement data encryption at rest
- Use HTTPS for all communications
- Implement proper data retention policies
- GDPR compliance (if applicable)
- Add privacy policy and terms of service

---

## 🚀 Quick Implementation Priority

### Immediate (Do Now):
1. Add `.env` to `.gitignore` and rotate all credentials
2. Install and configure `helmet`
3. Add input validation and sanitization
4. Fix rate limiting configuration
5. Add file upload validation

### Short Term (This Week):
1. Implement password complexity requirements
2. Hash email verification tokens
3. Add JWT token validation improvements
4. Configure CORS properly
5. Add request body size limits

### Medium Term (This Month):
1. Implement account lockout mechanism
2. Add comprehensive logging
3. Set up monitoring and alerting
4. Implement token refresh mechanism
5. Add security headers

### Long Term (Ongoing):
1. Regular security audits
2. Dependency updates
3. Penetration testing
4. Security training for team
5. Implement MFA

---

## 📦 Recommended NPM Packages

```bash
npm install helmet express-mongo-sanitize xss-clean hpp express-validator winston envalid
```

---

## 🔗 Useful Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

**Last Updated:** 2024
**Reviewed By:** Security Audit
**Next Review:** Quarterly
