import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BackendHealth from "./pages/BackendHealth";
import DBHealth from "./pages/DBHealth";
import ProtectedRoute from "./components/ProtectedRoute";

function LoginPlaceholder() {
  return (
    <div>
      <h2>Login Page</h2>
      <p>Simulate login by setting localStorage:</p>
      <button onClick={() => { localStorage.setItem('token', 'fake-jwt'); localStorage.setItem('role', 'Customer'); window.location.href='/'; }}>Login Customer</button>
      <button onClick={() => { localStorage.setItem('token', 'fake-jwt'); localStorage.setItem('role', 'Admin'); window.location.href='/'; }} style={{marginLeft: 10}}>Login Admin</button>
      <button onClick={() => { localStorage.clear(); window.location.href='/'; }} style={{marginLeft: 10}}>Logout</button>
    </div>
  );
}

function UnauthorizedPlaceholder() {
  return <div><h2>403 - Unauthorized</h2><p>You do not have permission to view this page.</p><Link to="/">Go Home</Link></div>;
}

function AdminDashboardPlaceholder() {
  return <div><h2>Admin Dashboard</h2><p>Secure area! Only admins can see this.</p><Link to="/">Go Home</Link></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <main style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <Routes>
          <Route path="/" element={
            <>
              <h1>MiniStore</h1>
              <p>Frontend scaffold is ready. Navigation added for endpoints.</p>
              <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Link to="/backend-healthcheck" style={{ padding: '0.5rem 1rem', background: '#eee', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Backend Healthcheck</Link>
                <Link to="/db-healthcheck" style={{ padding: '0.5rem 1rem', background: '#eee', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>DB Healthcheck</Link>
                <Link to="/admin" style={{ padding: '0.5rem 1rem', background: '#ffcccc', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Admin Dashboard (Protected)</Link>
                <Link to="/login" style={{ padding: '0.5rem 1rem', background: '#cceeff', textDecoration: 'none', color: '#333', borderRadius: '4px' }}>Login</Link>
              </nav>
            </>
          } />
          
          {/* Public Routes */}
          <Route path="/login" element={<LoginPlaceholder />} />
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
