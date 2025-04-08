import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

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
          <Nav className="ms-auto">
            <Form className="d-flex gap-2 align-items-center">
              <Form.Control
                type="search"
                placeholder="Buscar..."
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Form.Select
                value={selectedPlatform}
                onChange={handlePlatformChange}
                className="me-2"
                style={{ width: '200px' }}
              >
                {platformOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
              <Button 
                as={Link} 
                to="/games/new" 
                variant="success"
                className="d-flex align-items-center gap-2 px-3 py-1"
                style={{ 
                  whiteSpace: 'nowrap', 
                  fontSize: '0.9rem',
                  width: '200px',
                  justifyContent: 'center'
                }}
              >
                <i className="bi bi-plus-circle"></i>
                Añadir
              </Button>
            </Form>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar; 