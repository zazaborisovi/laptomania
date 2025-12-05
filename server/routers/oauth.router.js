const express = require('express');
const { googleCallback, getGoogleAuthUrl, getGithubAuthUrl, githubCallback } = require('../controllers/oauth.controller');

const oauthRouter = express.Router();


oauthRouter.get('/google', getGoogleAuthUrl);
oauthRouter.get('/google/callback', googleCallback);
oauthRouter.get('/github', getGithubAuthUrl);
oauthRouter.get('/github/callback', githubCallback);


module.exports = oauthRouter;