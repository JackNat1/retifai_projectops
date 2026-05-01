import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProjectsPage from './pages/Projects';
import AreasPage from './pages/Areas';
import ItemsPage from './pages/Items';
import VendorsPage from './pages/Vendors';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/dashboard" element={<div className="text-gray-600">Dashboard Page (Coming Soon)</div>} />
          <Route path="/bom" element={<div className="text-gray-600">BOM Page (Coming Soon)</div>} />
          <Route path="/procurement" element={<div className="text-gray-600">Procurement Page (Coming Soon)</div>} />
          <Route path="/tasks" element={<div className="text-gray-600">Tasks Page (Coming Soon)</div>} />
          <Route path="/reports" element={<div className="text-gray-600">Reports Page (Coming Soon)</div>} />
          <Route path="/" element={<Navigate to="/projects" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
