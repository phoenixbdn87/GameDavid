import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function GameList({ searchTerm, platformFilter }) {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

  const filterGames = useCallback(() => {
    let filtered = games;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTermLower)
      );
    }

    // Filtrar por plataforma
    if (platformFilter) {
      filtered = filtered.filter(game => {
        // Manejar tanto arrays como strings
        if (Array.isArray(game.platform)) {
          return game.platform.includes(platformFilter);
        } else {
          return game.platform === platformFilter;
        }
      });
    }

    // Ordenar alfabéticamente por nombre
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredGames(filtered);
  }, [games, searchTerm, platformFilter]);

  useEffect(() => {
    filterGames();
  }, [filterGames]);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/games`);
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/games/${id}`);
      fetchGames();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const formatPlatforms = (platform) => {
    if (Array.isArray(platform)) {
      return platform.join(', ');
    }
    return platform;
  };

  const renderGridView = () => (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {filteredGames.map((game) => (
        <Col key={game._id}>
          <Card className="h-100">
            <div className="ratio ratio-16x9">
              <Card.Img 
                variant="top" 
                src={game.image} 
                style={{ 
                  objectFit: 'contain',
                  objectPosition: 'center',
                  backgroundColor: '#f8f9fa'
                }} 
              />
            </div>
            <Card.Body className="d-flex flex-column">
              <Card.Title>{game.name}</Card.Title>
              <Card.Text>
                <small className="text-muted">
                  Plataformas: {formatPlatforms(game.platform)}
                </small>
              </Card.Text>
              <div className="mt-auto d-flex justify-content-between">
                <Button
                  className="btn-edit"
                  as={Link}
                  to={`/games/${game._id}/edit`}
                >
                  <i className="bi bi-pencil-square"></i> Editar
                </Button>
                <Button
                  className="btn-delete"
                  onClick={() => handleDelete(game._id)}
                >
                  <i className="bi bi-trash"></i> Eliminar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderListView = () => (
    <ListGroup>
      {filteredGames.map((game) => (
        <ListGroup.Item key={game._id} className="d-flex align-items-center">
          <div className="me-3" style={{ width: '150px', height: '100px' }}>
            <img
              src={game.image}
              alt={game.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#f8f9fa'
              }}
            />
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-1">{game.name}</h5>
            <small className="text-muted">
              Plataformas: {formatPlatforms(game.platform)}
            </small>
          </div>
          <div className="ms-3 d-flex align-items-center">
            <Button
              className="btn-edit me-2"
              as={Link}
              to={`/games/${game._id}/edit`}
              title="Editar"
            >
              <i className="bi bi-pencil-square"></i>
            </Button>
            <Button
              className="btn-delete"
              onClick={() => handleDelete(game._id)}
              title="Eliminar"
            >
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Lista de Videojuegos</h1>
        <div className="btn-group">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('grid')}
          >
            <i className="bi bi-grid-3x3-gap"></i> Cuadrícula
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('list')}
          >
            <i className="bi bi-list-ul"></i> Lista
          </Button>
        </div>
      </div>
      {filteredGames.length === 0 && (searchTerm || platformFilter) ? (
        <div className="alert alert-info">
          No se encontraron juegos con los criterios de búsqueda seleccionados
        </div>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderListView()
      )}
    </div>
  );
}

export default GameList; 