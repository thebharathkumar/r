const Parser = require('rss-parser');
const Content = require('../models/Content');

const parser = new Parser();

// List of RSS feeds for different topics
const RSS_FEEDS = [
  { url: 'https://dev.to/feed', source: 'DEV.to', tags: ['programming', 'webdev'] },
  { url: 'https://css-tricks.com/feed/', source: 'CSS-Tricks', tags: ['css', 'webdev', 'design'] },
  { url: 'https://www.smashingmagazine.com/feed/', source: 'Smashing Magazine', tags: ['webdev', 'design', 'ux'] },
  { url: 'https://medium.com/feed/tag/javascript', source: 'Medium', tags: ['javascript', 'programming'] },
  { url: 'https://www.freecodecamp.org/news/rss/', source: 'freeCodeCamp', tags: ['programming', 'tutorials'] }
];

// Estimate reading time based on text length
const estimateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return Math.max(1, time); // Minimum 1 minute
};

// Extract keywords and determine difficulty
const extractTags = (title, content, feedTags) => {
  const text = `${title} ${content}`.toLowerCase();
  const keywords = {
    javascript: ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
    python: ['python', 'django', 'flask', 'pandas'],
    webdev: ['web', 'html', 'css', 'frontend', 'backend'],
    design: ['design', 'ui', 'ux', 'figma'],
    ai: ['ai', 'machine learning', 'ml', 'artificial intelligence'],
    data: ['data', 'analytics', 'visualization'],
    cloud: ['cloud', 'aws', 'azure', 'gcp'],
    mobile: ['mobile', 'ios', 'android', 'react native']
  };

  const tags = new Set(feedTags);

  for (const [tag, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      tags.add(tag);
    }
  }

  return Array.from(tags);
};

// Determine difficulty based on content
const determineDifficulty = (text) => {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('beginner') || lowerText.includes('introduction') ||
      lowerText.includes('getting started') || lowerText.includes('basics')) {
    return 'beginner';
  }

  if (lowerText.includes('advanced') || lowerText.includes('expert') ||
      lowerText.includes('deep dive') || lowerText.includes('mastering')) {
    return 'advanced';
  }

  return 'intermediate';
};

// Create summary from content
const createSummary = (content) => {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Get first 200 characters
  const summary = text.substring(0, 200).trim();
  return summary + (summary.length >= 200 ? '...' : '');
};

// Fetch and parse RSS feeds
const fetchRSSFeeds = async (io) => {
  console.log('Starting RSS feed fetch...');
  let newContentCount = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const rssFeed = await parser.parseURL(feed.url);

      for (const item of rssFeed.items.slice(0, 5)) { // Get latest 5 items per feed
        try {
          // Check if content already exists
          const exists = await Content.findOne({ link: item.link });
          if (exists) continue;

          const contentText = item.content || item.contentSnippet || item.summary || '';
          const title = item.title || 'Untitled';

          const newContent = new Content({
            title,
            link: item.link,
            summary: createSummary(contentText),
            tags: extractTags(title, contentText, feed.tags),
            readingTime: estimateReadingTime(contentText),
            difficulty: determineDifficulty(title + ' ' + contentText),
            source: feed.source,
            createdAt: item.pubDate ? new Date(item.pubDate) : new Date()
          });

          await newContent.save();
          newContentCount++;

          // Emit real-time update via Socket.io
          if (io) {
            io.emit('newContent', newContent);
          }

          console.log(`Added: ${title}`);
        } catch (error) {
          console.error(`Error processing item from ${feed.source}:`, error.message);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${feed.url}:`, error.message);
    }
  }

  console.log(`RSS fetch complete. Added ${newContentCount} new items.`);
  return newContentCount;
};

module.exports = { fetchRSSFeeds };
