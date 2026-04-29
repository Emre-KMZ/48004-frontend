import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const BACKEND_URL = 'http://localhost:8000';
const FALLBACK_IMAGE = 'https://placehold.co/400x250/FCE4EC/D81B60?text=No+Image';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories/');
        setCategories(res.data.categories || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.1rem', color: '#999' }}>Loading categories...</div>;
  }

  return (
    <div style={{ marginTop: '2rem', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
      <h1 style={{ color: '#D81B60', marginBottom: '0.25rem', fontSize: '2rem' }}>Shop by Category</h1>
      <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.05rem' }}>Browse our categories and find what you're looking for.</p>

      {categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid #FCE4EC' }}>
          <h2 style={{ color: '#D81B60' }}>No categories available yet.</h2>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem',
      }}>
        {categories.map(cat => {
          const imageUrl = cat.image_url ? `${BACKEND_URL}${cat.image_url}` : FALLBACK_IMAGE;
          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              style={{
                cursor: 'pointer',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#fff',
                border: '1px solid #FCE4EC',
                boxShadow: '0 4px 15px rgba(233,30,99,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(233,30,99,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(233,30,99,0.06)';
              }}
            >
              <img
                src={imageUrl}
                alt={cat.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem 1.25rem' }}>
                <h3 style={{ margin: '0 0 0.25rem 0', color: '#D81B60', fontSize: '1.2rem', fontWeight: '600' }}>{cat.name}</h3>
                {cat.description && (
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {cat.description.length > 80 ? cat.description.substring(0, 80) + '...' : cat.description}
                  </p>
                )}
                <span style={{
                  display: 'inline-block',
                  background: '#FCE4EC',
                  color: '#D81B60',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                }}>
                  {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
