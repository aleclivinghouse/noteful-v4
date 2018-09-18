'use strict';

const express = require('express');
const router = express.Router();
const { MONGODB_URI } = require('../config');
const mongoose = require('mongoose');
const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const re = new RegExp(searchTerm, 'gi');
  console.log('Get All Notes');
  Note.find(
    { $or: [{title: re}, {content:re}]}
  ).then(results=>{
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
  // const newItem = {
  //   title: title,
  //   content: content
  // }
  if (!title) {
  const err = new Error('Missing `title` in request body');
  err.status = 400;
  return next(err);
}
  Note.create({title: title, content: content}).then(result=>{
    console.log('below is the new note we created ');
    console.log(result);
    res.json(result);
  })
  .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );


  //
  // console.log('Create a Note');
  // res.location('path/to/new/document').status(201).json({ id: 2, title: 'Temp 2' });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  console.log('Update a Note');
  res.json({ id: 1, title: 'Updated Temp 1' });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  console.log('Delete a Note');
  res.status(204).end();
});

module.exports = router;
