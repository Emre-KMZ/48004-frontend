import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateEmail = (email) => {
    // A standard format: text @ text . text (at least 2 characters for domain)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 6 characters, at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation: Empty fields
    if (!formData.full_name || !formData.email || !formData.password || !formData.confirm_password) {
      setError('All fields are required.');
      return;
    }

    // Client-side validation: Email regex
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    // Client-side validation: Password Strength
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long and include: 1 uppercase letter, 1 lowercase letter, and 1 number.');
      return;
    }

    // Client-side validation: Passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send secure payload without role or confirm_password
      const response = await api.post('/api/register/', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Something went wrong with the server. Please try again later.');
      }
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
      <h2 style={{ textAlign: 'center', marginTop: '2rem', color: '#333' }}>Create an Account</h2>
      <form onSubmit={handleSubmit} style={formStyle} noValidate>
        {error && <div style={{ color: '#d32f2f', padding: '0.75rem', background: '#ffebee', borderRadius: '4px', border: '1px solid #ef9a9a' }}>{error}</div>}
        {success && <div style={{ color: '#2e7d32', padding: '0.75rem', background: '#e8f5e9', borderRadius: '4px', border: '1px solid #a5d6a7' }}>Success! Redirecting to login...</div>}
        
        <label style={labelStyle}>
          Full Name
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} style={inputStyle} placeholder="John Doe" />
        </label>
        
        <label style={labelStyle}>
          Email Address
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="john@example.com" />
        </label>
        
        <label style={labelStyle}>
          Password
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} placeholder="••••••••" />
        </label>
        
        <label style={labelStyle}>
          Confirm Password
          <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} style={inputStyle} placeholder="••••••••" />
        </label>
        
        <button type="submit" style={buttonStyle}>Register</button>
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#0066cc' }}>Log In</Link>
        </div>
      </form>
    </div>
  );
}
