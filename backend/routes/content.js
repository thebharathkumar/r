const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Content = require('../models/Content');

// @route   GET /api/content/feed
// @desc    Get personalized feed based on user interests
// @access  Private
router.get('/feed', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userInterests = req.user.interests;

    let query = {};

    // If user has interests, filter by them
    if (userInterests && userInterests.length > 0) {
      query.tags = { $in: userInterests };
    }

    // Get total count for pagination
    const total = await Content.countDocuments(query);

    // Fetch content with pagination
    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/content/all
// @desc    Get all content (fallback if no interests)
// @access  Private
router.get('/all', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await Content.countDocuments();
    const content = await Content.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
