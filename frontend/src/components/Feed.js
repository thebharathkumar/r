import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { contentAPI } from '../services/api';
import socketService from '../services/socket';
import FeedItem from './FeedItem';
import './Feed.css';

const Feed = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newContentNotification, setNewContentNotification] = useState(false);

  const { user } = useAuth();

  const loadFeed = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');

      const response = user.interests && user.interests.length > 0
        ? await contentAPI.getFeed(pageNum)
        : await contentAPI.getAllContent(pageNum);

      if (pageNum === 1) {
        setContent(response.data.content);
      } else {
        setContent((prev) => [...prev, ...response.data.content]);
      }

      setHasMore(pageNum < response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Failed to load feed');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed(1);

    // Connect to Socket.io for real-time updates
    socketService.connect();

    const handleNewContent = (newItem) => {
      console.log('New content received:', newItem);
      setNewContentNotification(true);
    };

    socketService.on('newContent', handleNewContent);

    return () => {
      socketService.off('newContent', handleNewContent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.interests]);

  const refreshFeed = () => {
    setNewContentNotification(false);
    setPage(1);
    loadFeed(1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadFeed(nextPage);
  };

  if (loading && content.length === 0) {
    return (
      <div className="feed-container">
        <div className="loading">Loading your personalized feed...</div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>📚 Your Learning Feed</h1>
        {user.interests && user.interests.length > 0 && (
          <div className="active-interests">
            <p>Filtering by:</p>
            <div className="interest-tags">
              {user.interests.map((interest) => (
                <span key={interest} className="tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {newContentNotification && (
        <div className="new-content-notification" onClick={refreshFeed}>
          <span>🎉 New content available! Click to refresh</span>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {content.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No content found. Try updating your interests in your profile!</p>
        </div>
      ) : (
        <div className="feed-grid">
          {content.map((item) => (
            <FeedItem key={item._id} item={item} />
          ))}
        </div>
      )}

      {hasMore && content.length > 0 && (
        <div className="load-more">
          <button onClick={loadMore} disabled={loading} className="btn-secondary">
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;
