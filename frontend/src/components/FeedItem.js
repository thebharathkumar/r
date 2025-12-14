import React from 'react';
import './FeedItem.css';

const difficultyColors = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

const FeedItem = ({ item }) => {
  const openLink = () => {
    window.open(item.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="feed-item" onClick={openLink}>
      <div className="feed-item-header">
        <span className="source">{item.source}</span>
        <span
          className="difficulty"
          style={{ backgroundColor: difficultyColors[item.difficulty] }}
        >
          {item.difficulty}
        </span>
      </div>

      <h3 className="feed-item-title">{item.title}</h3>

      <p className="feed-item-summary">{item.summary}</p>

      <div className="feed-item-footer">
        <div className="tags">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="meta">
          <span className="reading-time">⏱ {item.readingTime} min read</span>
        </div>
      </div>
    </div>
  );
};

export default FeedItem;
