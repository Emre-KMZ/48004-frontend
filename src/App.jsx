import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BackendHealth from "./pages/BackendHealth";
import DBHealth from "./pages/DBHealth";

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
              </nav>
            </>
          } />
          <Route path="/backend-healthcheck" element={<BackendHealth />} />
          <Route path="/db-healthcheck" element={<DBHealth />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
