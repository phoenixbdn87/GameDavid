import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const platformOptions = [
  { value: '', label: 'Todas' },
  { value: 'PS5', label: 'PS5' },
  { value: 'Switch', label: 'Nintendo Switch' },
  { value: 'Xbox', label: 'Xbox' },
  { value: 'Steam', label: 'Steam' }
];

function Navbar({ onSearch, onPlatformFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handlePlatformChange = (e) => {
    const value = e.target.value;
    setSelectedPlatform(value);
    onPlatformFilter(value);
  };

  return (
    <BootstrapNavbar variant="dark" expand="lg" className="px-3">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/logo_header.png"
            alt="Game Collection"
            className="navbar-logo"
          />
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <div className="d-flex align-items-center gap-3">
            <Link to="/games/new" className="btn-add-game">
              <i className="bi bi-plus-lg"></i>
              <span className="d-none d-md-inline">Añadir Juego</span>
            </Link>
            <Form className="d-flex gap-2">
              <Form.Control
                type="search"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ minWidth: '120px' }}
              />
              <Form.Select
                value={selectedPlatform}
                onChange={handlePlatformChange}
                style={{ minWidth: '120px' }}
              >
                <option value="">Todas las plataformas</option>
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar; 