const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const router = express.Router();

router.post('/', (req, res)=>{
  let {username, password} = req.body;
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field=>!(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

const sizedFields = {
  username: {
    min: 1
  },
  password: {
    min: 8,
    max: 72
  }
};

const tooSmallField = Object.keys(sizedFields).find(
  field => 'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
);
const tooLargeField = Object.keys(sizedFields).find(
  field => 'max' in sizedFields[field] &&
           req.body[field].trim().length > sizedFields[field].max
);

if (tooSmallField || tooLargeField) {
  return res.status(422).json({
    code: 422,
    reason: 'ValidationError',
    message: tooSmallField
      ? `Must be at least ${sizedFields[tooSmallField]
        .min} characters long`
      : `Must be at most ${sizedFields[tooLargeField]
        .max} characters long`,
    location: tooSmallField || tooLargeField
  });
}

return User.hashPassword(password)
  .then(digest => {
    const newUser = {
      username,
      password: digest
    }
    return User.create(newUser);
  })
  .then(result => {
    return res.status(201).json(result);
  })
  .catch(err => {
    if (err.code === 11000) {
      err = new Error('The username already exists');
      err.status = 400;
    }
  });
});

module.exports = router;
