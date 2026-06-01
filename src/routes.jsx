import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SOS from './pages/SOS';
import Contacts from './pages/Contacts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sos" element={<SOS />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}