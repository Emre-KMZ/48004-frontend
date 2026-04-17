import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const BACKEND_URL = 'http://localhost:8000';
const FALLBACK_IMAGE = 'https://placehold.co/800x600/eeeeee/999999?text=No+Image+Available';

export default function ProductDetail() {
  const { id } = useParams();
  const { auth } = useAuth();
  const [product, setProduct] = useState(null);
  const [featuredImage, setFeaturedImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await api.get(`/api/products/${id}/`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
            setFeaturedImage(`${BACKEND_URL}${res.data.images[0].url}`);
        } else {
            setFeaturedImage(FALLBACK_IMAGE);
        }
      } catch (err) {
        setError('Failed to fetch product details.');
      }
    };
    loadDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if(!product) return;
    if (auth?.token) {
        try {
            await api.post('/api/cart/', { product_id: product.id, quantity: 1 });
            alert(`Added ${product.name} to persistent Account Cart!`);
        } catch(e) { alert("Failed to add to cart on the server."); }
    } else {
        const existing = JSON.parse(localStorage.getItem('cart') || '[]');
        const idx = existing.findIndex(x => x.product_id === product.id);
        if (idx >= 0) existing[idx].quantity += 1;
        else existing.push({ product_id: product.id, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(existing));
        alert(`Added ${product.name} to Offline Cart!`);
    }
  }

  if (error) return <div style={{ padding: '2rem', color: 'red', textAlign:'center' }}>{error} - <Link to="/">Go Back</Link></div>;
  if (!product) return <div style={{ padding: '2rem', textAlign:'center' }}>Loading Details...</div>;

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', marginTop: '2rem' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', textDecoration: 'none', color: '#0066cc' }}>&larr; Back to Gallery</Link>
      
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        {/* Gallery Stack */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img src={featuredImage} alt="Main" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }} />
            
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                {product.images && product.images.map(img => (
                    <img 
                        key={img.id}
                        src={`${BACKEND_URL}${img.url}`}
                        onClick={() => setFeaturedImage(`${BACKEND_URL}${img.url}`)}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: featuredImage.includes(img.url) ? '2px solid #0066cc' : '1px solid #ccc' }}
                        alt="Sub"
                    />
                ))}
            </div>
        </div>

        {/* Info Stack */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>{product.name}</h1>
            {product.category_name && <span style={{ padding: '0.2rem 0.5rem', background: '#e0e0e0', borderRadius: '12px', fontSize: '0.8rem', width: 'fit-content', marginBottom: '1.5rem' }}>{product.category_name}</span>}
            
            <div style={{ fontSize: '2rem', color: '#2e7d32', fontWeight: 'bold', marginBottom: '1.5rem' }}>${product.price}</div>
            
            <p style={{ lineHeight: '1.6', color: '#444', marginBottom: '2rem' }}>{product.description}</p>
            
            <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee', marginBottom: '2rem' }}>
                <strong>Availability: </strong> 
                <span style={{ color: product.stock > 0 ? '#2e7d32' : 'red' }}>
                    {product.stock > 0 ? `${product.stock} Units left` : 'Out of Stock'}
                </span>
            </div>

            <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                style={{ padding: '1rem', fontSize: '1.2rem', background: product.stock > 0 ? '#ff9900' : '#ccc', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: product.stock > 0 ? 'pointer' : 'not-allowed' }}>
                {product.stock > 0 ? 'Add to Basket' : 'Currently Unavailable'}
            </button>
        </div>
      </div>
    </div>
  );
}
