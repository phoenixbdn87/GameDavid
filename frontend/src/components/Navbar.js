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
          <i className="bi bi-controller me-2"></i>
          <span className="d-none d-sm-inline">Game Collection</span>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <i className="bi bi-house-door me-1"></i>
              <span className="d-none d-sm-inline">Inicio</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/games/new" className="d-flex align-items-center">
              <i className="bi bi-plus-circle me-1"></i>
              <span className="d-none d-sm-inline">Nuevo Juego</span>
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Buscar..."
              className="me-2"
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
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar; 