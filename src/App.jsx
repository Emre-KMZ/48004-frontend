import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import BackendHealth from "./pages/BackendHealth";
import DBHealth from "./pages/DBHealth";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";

function LoginPlaceholder() {
  // To simulate catching the redirect message easily
  const location = useLocation();
  const msg = location.state?.message;

  return (
    <div style={{maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px'}}>
      <h2>Login Page</h2>
      {msg && <div style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', background: '#efe' }}>{msg}</div>}
      <p>Simulate login by setting localStorage:</p>
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem'}}>
        <button style={{padding: '0.5rem'}} onClick={() => { localStorage.setItem('token', 'fake-jwt'); localStorage.setItem('role', 'Customer'); window.location.href='/'; }}>Login Customer</button>
        <button style={{padding: '0.5rem'}} onClick={() => { localStorage.setItem('token', 'fake-jwt'); localStorage.setItem('role', 'Admin'); window.location.href='/'; }}>Login Admin</button>
        <button style={{padding: '0.5rem', background: '#eee'}} onClick={() => { localStorage.clear(); window.location.href='/'; }}>Logout</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#0066cc' }}>Register here</Link>
      </div>
    </div>
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
    <BrowserRouter>
      <main style={{ fontFamily: "system-ui, sans-serif", padding: 24, margin: '0 auto', maxWidth: '800px' }}>
        <Routes>
          <Route path="/" element={
            <div style={{background: '#f4f4f4', padding: '2rem', borderRadius: '8px'}}>
              <h1>MiniStore</h1>
              <p>Welcome to our Veterinary E-Commerce Application.</p>
              <nav style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <Link to="/backend-healthcheck" style={{ padding: '0.5rem 1rem', background: '#ddd', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Backend Healthcheck</Link>
                <Link to="/db-healthcheck" style={{ padding: '0.5rem 1rem', background: '#ddd', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>DB Healthcheck</Link>
                <Link to="/admin" style={{ padding: '0.5rem 1rem', background: '#ffcccc', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Admin Dashboard</Link>
                <Link to="/login" style={{ padding: '0.5rem 1rem', background: '#cceeff', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Login</Link>
                <Link to="/register" style={{ padding: '0.5rem 1rem', background: '#ccffcc', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Register</Link>
              </nav>
            </div>
          } />
          
          {/* Public Routes */}
          <Route path="/login" element={<LoginPlaceholder />} />
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
  );
}
