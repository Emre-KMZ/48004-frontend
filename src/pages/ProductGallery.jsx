import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const FALLBACK_IMAGE = 'https://placehold.co/600x400/eeeeee/999999?text=No+Image+Available';
const BACKEND_URL = 'http://localhost:8000';

export default function ProductGallery({ sidebarOpen }) {
  const { auth } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const catRes = await api.get('/api/categories/');
        setCategories(catRes.data.categories || []);
        
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
    
    // 300ms Debounce wrapper preventing API spam on rapid typing
    const delay = setTimeout(() => {
        fetchAll();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, activeCategory]);

  const handleAddToCart = async (p) => {
    if (auth?.token) {
        // Authenticated -> Sync to Backend immediately
        try {
            await api.post('/api/cart/', { product_id: p.id, quantity: 1 });
            alert(`Added ${p.name} to persistent Account Cart!`);
        } catch(e) { alert("Failed to add to cart on the server."); }
    } else {
        // Guest -> Sync to Offline LocalStorage
        const existing = JSON.parse(localStorage.getItem('cart') || '[]');
        const idx = existing.findIndex(x => x.product_id === p.id);
        if (idx >= 0) existing[idx].quantity += 1;
        else existing.push({ product_id: p.id, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(existing));
        alert(`Added ${p.name} to Offline Cart!`);
    }
  }

  return (
    <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
            {/* LEFT COMPONENT: CATEGORY & FUTURE EXTENSION SIDEBAR */}
            <aside style={{ width: sidebarOpen ? '250px' : '0px', overflow: 'hidden', flexShrink: 0, transition: 'width 0.3s ease-in-out', opacity: sidebarOpen ? 1 : 0 }}>
                <div style={{ width: '250px' }}>
                    <h3 style={{ borderBottom: '2px solid #FCE4EC', paddingBottom: '0.5rem', color: '#D81B60' }}>Categories</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li 
                            onClick={() => setActiveCategory('')} 
                            style={{ padding: '0.75rem 1rem', cursor: 'pointer', background: activeCategory === '' ? '#E91E63' : 'transparent', color: activeCategory === '' ? 'white' : '#555', borderRadius: '8px', marginBottom: '0.25rem', transition: 'all 0.2s', fontWeight: activeCategory === '' ? '600' : '400' }}>
                            All Products
                        </li>
                        {categories.map(c => (
                            <li 
                                key={c.id} 
                                onClick={() => setActiveCategory(c.name)}
                                style={{ padding: '0.75rem 1rem', cursor: 'pointer', background: activeCategory === c.name ? '#E91E63' : '#fff', color: activeCategory === c.name ? 'white' : '#555', borderRadius: '8px', marginBottom: '0.25rem', transition: 'all 0.2s', fontWeight: activeCategory === c.name ? '600' : '400', boxShadow: activeCategory !== c.name ? '0 1px 3px rgba(0,0,0,0.02)' : 'none' }}>
                                {c.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* RIGHT COMPONENT: MAIN GRID */}
            <section style={{ flex: 1, minWidth: 0 }}>
            
            {/* TOP BAR: SEARCH BAR */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', maxWidth: '600px' }}>
                <input 
                    type="text" 
                    placeholder="Search by keywords or product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, padding: '1rem', fontSize: '1rem', borderRadius: '12px', border: '1px solid #F8BBD0', outlineColor: '#E91E63', fontFamily: 'Outfit' }}
                />
                <button 
                    onClick={() => { /* State already bound dynamically */ }}
                    title="Search"
                    style={{ width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8BBD0', color: '#D81B60', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s', alignSelf: 'center', flexShrink: 0, boxShadow: '0 2px 5px rgba(233,30,99,0.15)' }}>
                    ➜
                </button>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>Loading catalog...</div>}
            {error && <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>}
            {!loading && !error && products.length === 0 && <div style={{ textAlign: 'center', padding: '2rem' }}>No products match your criteria.</div>}

            {/* PRODUCT GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 200px)', gap: '1.5rem', justifyContent: 'flex-start' }}>
                {products.map(p => {
                    const imageUrl = p.images && p.images.length > 0 ? `${BACKEND_URL}${p.images[0].url}` : FALLBACK_IMAGE;

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
                                <button 
                                    onClick={() => handleAddToCart(p)}
                                    disabled={p.stock <= 0}
                                    style={{ padding: '0.6rem', background: p.stock > 0 ? '#E91E63' : '#ccc', color: 'white', fontWeight: '600', border: 'none', borderRadius: '25px', cursor: p.stock > 0 ? 'pointer' : 'not-allowed', marginTop: '0.25rem', fontFamily: 'Outfit', transition: 'background 0.2s' }}>
                                    {p.stock > 0 ? 'Add to Basket' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
        </div>
    </div>
  );
}
