'use strict';

const express = require('express');
const router = express.Router();
const { MONGODB_URI } = require('../config');
const mongoose = require('mongoose');
const Note = require('../models/note');
const Folder = require('../models/folder');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.folderId;
  let filter = {};

  if (searchTerm) {
  const re = new RegExp(searchTerm, 'i');
  filter.title = { $regex: re };
  }


  console.log('Get All Notes');
  Note.find(filter)
  .sort('created')
  .then(results=>{
    res.send(results);
  }).catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {

  const id = req.params.id;
  console.log('Get a Note');
  Note.findById(id).then(result =>{
    res.json(result);
  })
  .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const folderId = req.body.folderId;
  // const newItem = {
  //   title: title,
  //   content: content
  // }
  if (!title) {
  const err = new Error('Missing `title` in request body');
  err.status = 400;
  return next(err);
}
  const newNote = {};
  newNote.title = title;
  newNote.content = content;
  if (folderId) {
   if (!mongoose.Types.ObjectId.isValid(folderId)) {
     const err = new Error('The folderId is not valid');
     err.status = 400;
     return next(err);
   } else {
     newNote.folderId = folderId;
   }
 }
  Note.create(newNote).then(result=>{
    console.log('below is the new note we created ');
    console.log(result);
    res.json(result);
  })
  .catch(err =>
      res.status(404).json({ err: 'was not created, make sure to add a title' })
    );
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const id = req.params.id;
  Note.findByIdAndUpdate(id, {title: title, content: content}).then(result=>{
    res.json(result);
  })
  .catch(err =>
      res.status(404).json({ err: 'was not able to update make sure to add a title' })
    );
  console.log('Update a Note');
  // res.json({ id: 1, title: 'Updated Temp 1' });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id).then(result=>{
    res.status(204).end();
  })
  .catch(err =>
      res.status(404).json({ err: 'was not able to delete' })
    );
  console.log('Delete a Note');
  });


module.exports = router;
