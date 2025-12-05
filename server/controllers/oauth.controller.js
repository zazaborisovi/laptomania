const axios = require('axios');
const AppError = require('../utils/appError');
const User = require('../models/user.model');

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/oauth/facebook/callback";

const createSendToken = async (user, res) => {
    // Create JWT token
    const token = user.signToken();

    // Set cookie with the token
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'Lax',
        maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    };

    res.cookie('lg', token, cookieOptions);

    // Redirect to panel after setting cookie
    res.redirect(`${process.env.CLIENT_URL}/panel`);
}

const getGoogleAuthUrl = (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.MAIN_GOOGLE_ID,
        redirect_uri: process.env.MAIN_GOOGLE_REDIRECT,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    });


    res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
};

const googleCallback = async (req, res, next) => {
    try {
        const { code } = req.query;

        const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
            code,
            client_id: process.env.MAIN_GOOGLE_ID,
            client_secret: process.env.MAIN_GOOGLE_SECRET,
            redirect_uri: process.env.MAIN_GOOGLE_REDIRECT,
            grant_type: 'authorization_code'
        });

        const { access_token } = tokenResponse.data;

        const userInfo = await axios.get(GOOGLE_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const { email, name, picture, sub, email_verified } = userInfo.data;

        // First, check if user exists with this specific Google account
        let user = await User.findOne({ email });

        if(!user) {
            if(!email_verified) {
                return next(new AppError('Google account not verified', 400));
            }

            user = await User.create({
                fullname: name,
                email,
                avatar: picture,
                oauthid: sub,
                oauthProvider: 'google',
                isVerified: true,
            });
        }

        createSendToken(user, res);
    } catch(err) {
        console.log(err);
        res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
};

const getFacebookAuthUrl = (req, res) => {
    const params = new URLSearchParams({
        client_id: FACEBOOK_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: "public_profile,email",
    });

    res.redirect(`https://www.facebook.com/v17.0/dialog/oauth?${params.toString()}`);
};

const facebookCallback = async (req, res, next) => {
    try {
        const { code } = req.query;

        const tokenResponse = await axios.get("https://graph.facebook.com/v17.0/oauth/access_token", {
            params: {
                client_id: FACEBOOK_CLIENT_ID,
                client_secret: FACEBOOK_CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                code,
            },
        });

        const { access_token } = tokenResponse.data;

        const userInfo = await axios.get("https://graph.facebook.com/me", {
            params: {
                fields: "id,name,email,picture",
                access_token
            }
        });

        const { id, name, email, picture } = userInfo.data;

        if (!email) {
            return next(new AppError('Unable to retrieve email from Facebook account', 400));
        }

        // First, check if user exists with this specific Facebook account
        let user = await User.findOne({ oauthid: id, oauthProvider: 'facebook' });

        if(!user) {
            // Check if email is already registered with different provider
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.oauthProvider && existingUser.oauthProvider !== 'facebook') {
                return next(new AppError(`This email is already registered with ${existingUser.oauthProvider}. Please sign in with ${existingUser.oauthProvider}.`, 400));
            }

            // Check if email is registered with regular password
            if (existingUser && !existingUser.oauthProvider) {
                return next(new AppError('This email is already registered with password. Please sign in with email and password.', 400));
            }

            user = await User.create({
                fullname: name || 'Facebook User',
                email,
                avatar: picture?.data?.url || null,
                oauthid: id,
                oauthProvider: 'facebook',
                isVerified: true,
            });
        }

        createSendToken(user, res);
    } catch(err) {
        console.log(err);
        res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
};

// 'https://github.com/login/oauth/access_token',
// 'https://api.github.com/user',

const getGithubAuthUrl = (req, res) => {
    const rootUrl = 'https://github.com/login/oauth/authorize';
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
        scope: 'read:user user:email',
    });

    res.redirect(`${rootUrl}?${params.toString()}`);
};

const githubCallback = async (req, res, next) => {
    try {
        const { code } = req.query;

        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI
        }, {
            headers: {
                Accept: 'application/json'
            }
        });

        const { access_token } = tokenResponse.data;

        if (!access_token) {
            return next(new AppError('Failed to get access token from GitHub', 400));
        }

        const userInfo = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        let { id, name, email, avatar_url } = userInfo.data;

        // GitHub users can keep email private, so fetch from emails endpoint if not available
        if (!email) {
            const emailResponse = await axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            // Find primary verified email
            const primaryEmail = emailResponse.data.find(e => e.primary && e.verified);
            if (primaryEmail) {
                email = primaryEmail.email;
            }
        }

        if (!email) {
            return next(new AppError('Unable to retrieve email from GitHub account', 400));
        }

        // First, check if user exists with this specific GitHub account
        let user = await User.findOne({ email });

        if(!user) {
            user = await User.create({
                fullname: name || 'GitHub User',
                email,
                avatar: avatar_url,
                oauthid: id.toString(),
                oauthProvider: 'github',
                isVerified: true,
            });
        }


        createSendToken(user, res);

    } catch(err) {
        console.log(err);
        res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
}

module.exports = {googleCallback, getGoogleAuthUrl, getFacebookAuthUrl, facebookCallback, getGithubAuthUrl, githubCallback};