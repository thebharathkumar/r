import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const AVAILABLE_INTERESTS = [
  'javascript',
  'python',
  'webdev',
  'design',
  'ai',
  'data',
  'cloud',
  'mobile',
  'programming',
  'css',
  'ux',
  'tutorials'
];

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [interests, setInterests] = useState(user.interests || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      await userAPI.updateInterests(interests);
      updateUser({ interests });

      setMessage('Interests updated successfully!');
      setLoading(false);

      // Redirect to feed after 1 second
      setTimeout(() => {
        navigate('/feed');
      }, 1000);
    } catch (err) {
      setError('Failed to update interests');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>👤 Profile</h1>

        <div className="profile-info">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="interests-section">
          <h2>Your Interests</h2>
          <p className="hint">
            Select topics you're interested in to personalize your feed
          </p>

          <div className="interests-grid">
            {AVAILABLE_INTERESTS.map((interest) => (
              <button
                key={interest}
                className={`interest-tag ${
                  interests.includes(interest) ? 'selected' : ''
                }`}
                onClick={() => toggleInterest(interest)}
                disabled={loading}
              >
                {interest}
              </button>
            ))}
          </div>

          <div className="selected-count">
            {interests.length > 0
              ? `${interests.length} interests selected`
              : 'No interests selected - you will see all content'}
          </div>
        </div>

        <div className="profile-actions">
          <button
            onClick={handleSave}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
