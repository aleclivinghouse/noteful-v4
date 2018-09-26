const mongoose = require('mongoose');
const middleware = {

  // Allows an empty array
  // Doesn't check for the existence of the tag field. Use requireFields
  validateTagIds: (req, res, next) => {
    if(!Array.isArray(req.body.tags)) {
      const err = new Error('`tags` must be an array');
      err.status = 400;
      return next(err);
    }

    for(let id of req.body.tags) {
      if(!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('A tag id is not valid');
        err.status = 400;
        return next(err);
      }
    }

    return next();
  },

  // Doesn't check for the existence of the folderId field
  validateFolderId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body.folderId)) {
      const err = new Error('`folderId` is not set to a valid id');
      err.status = 400;
      return next(err);
    }
    return next();
  },

  validateParamId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const err = new Error('The note id provided in the URL is not valid');
      err.status = 404;
      return next(err);
    }
    return next();
  },

  validateBodyId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body.id)) {
      const err = new Error('The note id provided in the request body is not valid');
      err.status = 400;
      return next(err);
    }
    return next();
  }

};

module.exports = middleware;
