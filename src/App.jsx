import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BackendHealth from "./pages/BackendHealth";
import DBHealth from "./pages/DBHealth";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Navbar() {
  const { auth, logout } = useAuth();
  
  return (
    <nav style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
      <Link to="/" style={{ padding: '0.5rem 1rem', background: '#ddd', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Home</Link>
      <Link to="/backend-healthcheck" style={{ padding: '0.5rem 1rem', background: '#ddd', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Backend Status</Link>
      
      {/* Customer Links */}
      {auth.role === 'Customer' && (
        <>
          <Link to="#" style={{ padding: '0.5rem 1rem', background: '#ccffcc', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>My Cart</Link>
          <Link to="#" style={{ padding: '0.5rem 1rem', background: '#ccffcc', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>My Orders</Link>
        </>
      )}

      {/* Admin Links */}
      {auth.role === 'Admin' && (
        <>
          <Link to="#" style={{ padding: '0.5rem 1rem', background: '#ccffcc', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>My Cart</Link>
          <Link to="#" style={{ padding: '0.5rem 1rem', background: '#ccffcc', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>My Orders</Link>
          <Link to="/admin" style={{ padding: '0.5rem 1rem', background: '#ffcccc', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Admin Dashboard</Link>
        </>
      )}

      {/* Auth State Toggles */}
      {auth.token ? (
        <button onClick={() => { logout(); window.location.href='/'; }} style={{ padding: '0.5rem 1rem', background: '#cceeff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '1rem' }}>
          Logout ({auth.email})
        </button>
      ) : (
        <>
          <Link to="/login" style={{ padding: '0.5rem 1rem', background: '#cceeff', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Login</Link>
          <Link to="/register" style={{ padding: '0.5rem 1rem', background: '#ccffcc', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Register</Link>
        </>
      )}
    </nav>
  );
}

function UnauthorizedPlaceholder() {
  return <div style={{textAlign: 'center', padding: '2rem'}}><h2>403 - Unauthorized</h2><p>You do not have permission to view this page.</p><Link to="/">Go Home</Link></div>;
}

function AdminDashboardPlaceholder() {
  return <div style={{textAlign: 'center', padding: '2rem'}}><h2>Admin Dashboard</h2><p>Secure area! Only admins can see this.</p><Link to="/">Go Home</Link></div>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main style={{ fontFamily: "system-ui, sans-serif", padding: 24, margin: '0 auto', maxWidth: '800px' }}>
          <Routes>
            <Route path="/" element={
              <div style={{background: '#f4f4f4', padding: '2rem', borderRadius: '8px'}}>
                <h1>MiniStore</h1>
                <p>Welcome to our Veterinary E-Commerce Application.</p>
                <Navbar />
              </div>
            } />
            
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<UnauthorizedPlaceholder />} />
            <Route path="/backend-healthcheck" element={<BackendHealth />} />
            <Route path="/db-healthcheck" element={<DBHealth />} />

            {/* Protected Routes (Admin Only) */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin" element={<AdminDashboardPlaceholder />} />
            </Route>
            
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
