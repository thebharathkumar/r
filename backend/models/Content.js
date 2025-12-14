const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  readingTime: {
    type: Number, // in minutes
    default: 5
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  source: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster tag-based queries
contentSchema.index({ tags: 1 });
contentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema);
