import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const FALLBACK_IMAGE = 'https://placehold.co/600x400/eeeeee/999999?text=No+Image+Available';
const BACKEND_URL = 'http://localhost:8000';

function QtyInput({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        style={{ width: '26px', height: '26px', border: '1px solid #F8BBD0', background: '#FFF5F8', color: '#D81B60', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', lineHeight: 1 }}>
        −
      </button>
      <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        style={{ width: '26px', height: '26px', border: '1px solid #F8BBD0', background: '#FFF5F8', color: '#D81B60', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', lineHeight: 1 }}>
        +
      </button>
    </div>
  );
}

export default function ProductGallery() {
  const { auth } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [addedMap, setAddedMap] = useState({});

  // Filters
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        let url = `/api/products/?search=${searchQuery}`;
        if (activeCategory) url += `&category=${activeCategory}`;

        const prodRes = await api.get(url);
        setProducts(prodRes.data.products || []);
      } catch (err) {
        setError('Failed to load catalog constraints.');
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(() => { fetchAll(); }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, activeCategory]);

  const getQty = (productId) => quantities[productId] || 1;

  const setQty = (productId, value) => {
    setQuantities(prev => ({ ...prev, [productId]: value }));
  };

  const handleAddToBasket = async (product) => {
    if (product.stock <= 0) return;
    await addItem(product, getQty(product.id));
    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedMap(prev => ({ ...prev, [product.id]: false })), 1500);
  };

  return (
    <div style={{ marginTop: '1rem' }}>

      {/* Active filter indicator */}
      {(activeCategory || searchQuery) && (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {activeCategory && (
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{ background: '#FCE4EC', color: '#D81B60', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                Category: {activeCategory} ×
              </span>
            </Link>
          )}
          {searchQuery && (
            <span style={{ background: '#E8F5E9', color: '#388E3C', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600' }}>
              Search: "{searchQuery}"
            </span>
          )}
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>Loading catalog...</div>}
      {error && <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid #FCE4EC' }}>
          <h2 style={{ color: '#D81B60', marginBottom: '0.5rem' }}>
            {searchQuery ? `No results found for "${searchQuery}"` : activeCategory ? `No products in "${activeCategory}"` : 'No products found.'}
          </h2>
          <p style={{ color: '#666' }}>Try adjusting your search or browse our categories.</p>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 200px)', gap: '1.5rem', justifyContent: 'flex-start' }}>
        {products.map(p => {
          const imageUrl = p.images && p.images.length > 0 ? `${BACKEND_URL}${p.images[0].url}` : FALLBACK_IMAGE;
          const qty = getQty(p.id);
          const justAdded = addedMap[p.id];

          return (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', border: '1px solid #FCE4EC', borderRadius: '16px', padding: '1rem', background: '#fff', boxShadow: '0 4px 15px rgba(233,30,99,0.06)' }}>
              <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={imageUrl} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }} />
                <h3 style={{ margin: '0.75rem 0 0 0', color: '#D81B60', fontWeight: '600' }}>{p.name}</h3>
              </Link>
              {p.description && <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.85rem', flex: 1, lineHeight: '1.4' }}>{p.description.substring(0, 45)}...</p>}

              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontWeight: '700', fontSize: '1.3rem', color: '#333' }}>${p.price}</div>
                <div style={{ fontSize: '0.8rem', color: p.stock > 0 ? '#888' : '#D32F2F', fontWeight: p.stock > 0 ? '500' : '700' }}>
                  {p.stock > 0 ? `${p.stock} units available` : 'Out of stock!'}
                </div>
                {p.stock > 0 && (
                  <QtyInput value={qty} onChange={(v) => setQty(p.id, v)} />
                )}
                <button
                  onClick={() => handleAddToBasket(p)}
                  disabled={p.stock <= 0}
                  style={{ padding: '0.6rem', background: justAdded ? '#4CAF50' : (p.stock > 0 ? '#E91E63' : '#ccc'), color: 'white', fontWeight: '600', border: 'none', borderRadius: '25px', cursor: p.stock > 0 ? 'pointer' : 'not-allowed', fontFamily: 'Outfit', transition: 'background 0.2s' }}>
                  {justAdded ? '✓ Added!' : (p.stock > 0 ? 'Add to Basket' : 'Unavailable')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
