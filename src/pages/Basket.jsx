import React from 'react';
import { Link } from 'react-router-dom';

export default function Basket() {
  return (
    <div style={{ marginTop: '3rem', padding: '3rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(233,30,99,0.06)', border: '1px solid #FCE4EC', textAlign: 'center', fontFamily: 'Outfit' }}>
      <h1 style={{ color: '#D81B60', fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700' }}>My Basket</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        Basket functionality coming soon in a future update!
        <br />
        This page will securely display and modify items synced directly from the backend.
      </p>
      
      <Link to="/" style={{ padding: '0.8rem 2rem', background: '#E91E63', color: 'white', border: 'none', borderRadius: '25px', textDecoration: 'none', fontWeight: '600', transition: 'background 0.2s', display: 'inline-block' }}>
        Return to Gallery
      </Link>
    </div>
  );
}
