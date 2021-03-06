const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})
tagSchema.set('timestamps', true);
tagSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v;
  }
});

module.exports = mongoose.model('Tag', tagSchema);
