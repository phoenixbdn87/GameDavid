import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import Navbar from './components/Navbar';
import GameList from './components/GameList';
import GameForm from './components/GameForm';

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [futuribleFilter, setFuturibleFilter] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePlatformFilter = (platform) => {
    setPlatformFilter(platform);
  };

  const handleFuturibleFilter = (value) => {
    setFuturibleFilter(value);
  };

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="App">
        <div className="login-overlay">
          <div className="spinner" style={{ width: 50, height: 50 }}></div>
        </div>
      </div>
    );
  }

  // Mostrar modal de login si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="App">
        <LoginModal />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar
        onSearch={handleSearch}
        onPlatformFilter={handlePlatformFilter}
        onFuturibleFilter={handleFuturibleFilter}
      />
      <Container fluid="xxl" className="mt-4">
        <Routes>
          <Route
            path="/"
            element={
              <GameList
                searchTerm={searchTerm}
                platformFilter={platformFilter}
                futuribleFilter={futuribleFilter}
              />
            }
          />
          <Route path="/games/new" element={<GameForm />} />
          <Route path="/games/:id/edit" element={<GameForm />} />
        </Routes>
      </Container>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
