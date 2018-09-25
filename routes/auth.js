const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');

// const localAuth = passport.authenticate('local', {session: false, failWithError: true});
// Other statements removed for brevity
// passport.use(LocalStrategy);
const localAuth = passport.authenticate('local', {session: false});
function createAuthToken(user){
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});


module.exports = router;
