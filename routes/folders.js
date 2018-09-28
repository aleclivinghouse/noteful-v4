'use strict';
const express = require('express');
const router = express.Router();
const { MONGODB_URI } = require('../config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Note = require('../models/note');
const Folder = require('../models/folder');
const {requireFields, validateParamAndBodyId, validateParamId} = require('../utils/server-validation');


router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));
/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const userId = req.user.id;
  const searchTerm = req.query.searchTerm;
  const re = new RegExp(searchTerm, 'gi');
  console.log('Get All Folders');
  Folder.find({userId: userId}).then(results=>{
    res.send(results);
  }).catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', validateParamId, (req, res, next) => {
    const userId = req.user.id;
    const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The id is not valid');
    err.status = 400;
    return next(err);
}

  console.log('Get a Folder');
  Folder.findById({userId: userId, _id: id}).then(result =>{
    res.json(result);
  })
  .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});


/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const name = req.body.name;
  const userId = req.user.id;
  // const newItem = {
  //   name: name,
  //   content: content
  // }
  if (!name) {
  const err = new Error('Missing `name` in request body');
  err.status = 400;
  return next(err);
}
  Folder.create({name: name, userId: userId}).then(result=>{
    console.log('below is the new Folder we created ');
    console.log(result);
    res.json(result);
  })
  .catch(err =>
      res.status(404).json({ err: 'was not created, make sure to add a name' })
    );
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', validateParamId, (req, res, next) => {
    const name = req.body.name;
    const id = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
   const err = new Error('The `id` is not valid');
   err.status = 400;
   return next(err);
 }

 if (!name) {
   const err = new Error('Missing `name` in request body');
   err.status = 400;
   return next(err);
 }
    const updateFolder = { name: name, userId: userId};
    Folder.findByIdAndUpdate(id, updateFolder).then(result=>{
    res.json(result);
  })
  .catch(err => {
    if (err.code === 11000) {
      err = new Error('Folder name already exists');
      err.status = 400;
    }
    next(err);
  });
  console.log('Update a Folder');
  // res.json({ id: 1, title: 'Updated Temp 1' });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', validateParamId, (req, res, next) => {
  const id = req.params.id;
  Folder.findByIdAndRemove(id).then(result=>{
    res.status(204).end();
  })
  .catch(err =>
      res.status(404).json({ err: 'was not able to delete' })
    );
  console.log('Delete a Folder');
  });


module.exports = router;
