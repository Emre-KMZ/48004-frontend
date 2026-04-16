import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      const response = await api.post('/api/login/', { email, password });
      if (response.status === 200) {
        // Hydrate the Global Auth State and local storage via the context
        login(response.data.token, response.data.role, response.data.email);
        // Explicitly route to home page directly on success
        navigate('/');
      }
    } catch (err) {
      // Constraint 1: Generic failure response natively catches ANY error condition from /api/login/
      setError('Invalid email or password');
    }
  };

  const formStyle = {
    display: 'flex', flexDirection: 'column', gap: '1rem', 
    maxWidth: '400px', margin: '2rem auto', padding: '2rem', 
    border: '1px solid #ddd', borderRadius: '8px', background: '#fefefe',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  };
  const labelStyle = { display: 'flex', flexDirection: 'column', gap: '0.3em', fontWeight: 'bold', color: '#555' };
  const inputStyle = { padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' };
  const buttonStyle = { padding: '0.75rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginTop: '1rem' };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '2rem', color: '#333' }}>Log In</h2>
      <form onSubmit={handleSubmit} style={formStyle} noValidate>
        {error && <div style={{ color: '#d32f2f', padding: '0.75rem', background: '#ffebee', borderRadius: '4px', border: '1px solid #ef9a9a' }}>{error}</div>}
        
        <label style={labelStyle}>
          Email Address
          <input type="email" value={email} onChange={e => {setEmail(e.target.value); setError('');}} style={inputStyle} placeholder="john@example.com" />
        </label>
        
        <label style={labelStyle}>
          Password
          <input type="password" value={password} onChange={e => {setPassword(e.target.value); setError('');}} style={inputStyle} placeholder="••••••••" />
        </label>
        
        <button type="submit" style={buttonStyle}>Log In</button>
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#0066cc' }}>Register here</Link>
        </div>
      </form>
    </div>
  );
}
