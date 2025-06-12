const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  jokeId: {
    type: String,
    required: true,
    unique: true  // Ensure each joke has only one entry
  },
  totalRating: {
    type: Number,
    required: true,
    default: 0
  },
  ratingCount: {
    type: Number,
    required: true,
    default: 0
  },
}, { 
    timestamps: true // both the createdAt and updatedAt
});

module.exports = mongoose.model('Rating', ratingSchema);