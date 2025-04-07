import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function GameList({ searchTerm, platformFilter }) {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    filterGames();
  }, [searchTerm, platformFilter, games]);

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/games');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const filterGames = () => {
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
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/games/${id}`);
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

  return (
    <div>
      <h1 className="mb-4">Lista de Videojuegos</h1>
      {filteredGames.length === 0 && (searchTerm || platformFilter) ? (
        <div className="alert alert-info">
          No se encontraron juegos con los criterios de búsqueda seleccionados
        </div>
      ) : (
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
                      variant="primary"
                      as={Link}
                      to={`/games/${game._id}/edit`}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(game._id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default GameList; 