import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        fetchPosts();
      }
    } catch (err) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setPosts([]);
      setShowLogin(true);
    } catch (err) {
      console.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuth={setUser} showLogin={showLogin} setShowLogin={setShowLogin} fetchPosts={fetchPosts} />;
  }

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      <main className="main-content">
        <div className="new-post-button-container">
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="btn btn-primary"
          >
            ➕ New Post
          </button>
        </div>

        {showNewPost && (
          <NewPostForm 
            onPost={(newPost) => {
              setPosts([newPost, ...posts]);
              setShowNewPost(false);
            }} 
          />
        )}

        <PostList posts={posts} />
      </main>
    </div>
  );
}

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>My App</h1>
        <div className="header-user">
          <span>👤 {user.username}</span>
          <button onClick={onLogout} className="btn btn-secondary">
            🚪 Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function AuthForm({ onAuth, showLogin, setShowLogin, fetchPosts }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = showLogin ? 'login' : 'register';
    const payload = showLogin 
      ? { username: formData.username, password: formData.password }
      : formData;

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        onAuth(data.user);
        fetchPosts();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{showLogin ? 'Login' : 'Sign Up'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />

          {!showLogin && (
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Please wait...' : (showLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p>
          {showLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="link-button"
          >
            {showLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

function NewPostForm({ onPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content })
      });

      if (res.ok) {
        const data = await res.json();
        onPost(data.post);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      console.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-post-form">
      <h3>Create New Post</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post content (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="btn btn-success"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

function PostList({ posts }) {
  if (posts.length === 0) {
    return (
      <div className="empty-posts">
        <p>💬 No posts yet. Create your first post!</p>
      </div>
    );
  }

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          {post.content && <p>{post.content}</p>}
          <div className="post-meta">
            By {post.username} • {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
