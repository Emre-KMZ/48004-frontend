import { useState, useEffect } from 'react';
import api from '../api/axios';

// Generic interchangeable fallback image variable
const FALLBACK_IMAGE = 'https://placehold.co/600x400/eeeeee/999999?text=No+Image+Available';

export default function ProductGallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products/');
        setProducts(response.data.products || []);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading catalog...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  if (products.length === 0) return <div style={{ textAlign: 'center', padding: '2rem' }}>No products available currently.</div>;

  // Since Vite proxy doesn't rewrite image source domains directly, we resolve it to the backend natively
  const BACKEND_URL = 'http://localhost:8000';

  return (
    <div>
        <h2 style={{marginTop: '2rem'}}>Product Catalog</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem' }}>
        {products.map(p => {
            const imageUrl = p.image_url ? `${BACKEND_URL}${p.image_url}` : FALLBACK_IMAGE;

            return (
            <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', width: '250px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <img src={imageUrl} alt={p.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} />
                <h3 style={{ margin: '0.5rem 0 0 0' }}>{p.name}</h3>
                {p.description && <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>{p.description.substring(0, 50)}...</p>}
                
                <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2e7d32' }}>${p.price}</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', color: p.stock > 0 ? '#555' : '#d32f2f', fontWeight: p.stock > 0 ? 'normal' : 'bold' }}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock!'}
                    </div>
                </div>
            </div>
            );
        })}
        </div>
    </div>
  );
}
