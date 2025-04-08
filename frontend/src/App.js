import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';
import GameList from './components/GameList';
import GameForm from './components/GameForm';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePlatformFilter = (platform) => {
    setPlatformFilter(platform);
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          onSearch={handleSearch} 
          onPlatformFilter={handlePlatformFilter} 
        />
        <Container fluid="xxl" className="mt-4">
          <Routes>
            <Route 
              path="/" 
              element={
                <GameList 
                  searchTerm={searchTerm}
                  platformFilter={platformFilter}
                />
              } 
            />
            <Route path="/games/new" element={<GameForm />} />
            <Route path="/games/:id/edit" element={<GameForm />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App; 