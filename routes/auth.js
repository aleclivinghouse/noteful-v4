const express = require('express');
const router = express.Router();
const passport = require('passport');
const localAuth = passport.authenticate('local', {session: false, failWithError: true});
// Other statements removed for brevity
// passport.use(LocalStrategy);


router.post('/login', localAuth, function (req, res) {
  return res.json(req.user);
});

module.exports = router;
