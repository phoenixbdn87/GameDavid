import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Form, FormControl, Button, FormSelect } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar({ onSearch, onPlatformFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    // Realizar búsqueda cuando se tengan 3 o más caracteres
    if (searchTerm.length >= 3 || searchTerm.length === 0) {
      onSearch(searchTerm);
    }
  }, [searchTerm, onSearch]);

  useEffect(() => {
    onPlatformFilter(platform);
  }, [platform, onPlatformFilter]);

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="GamesDavid Logo"
            height="60"
            className="d-inline-block align-top"
          />
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
          </Nav>
          <Form className="d-flex me-3">
            <FormControl
              type="search"
              placeholder="Buscar juego..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Form.Select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="me-2"
              style={{ width: '150px' }}
            >
              <option value="">Todas</option>
              <option value="PS5">PS5</option>
              <option value="Switch">Nintendo Switch</option>
              <option value="Xbox">Xbox</option>
              <option value="Steam">Steam</option>
            </Form.Select>
          </Form>
          <Button
            as={Link}
            to="/games/new"
            variant="success"
            className="ms-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle me-2" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Agregar Juego
          </Button>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar; 