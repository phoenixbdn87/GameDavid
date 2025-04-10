import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, ListGroup, Pagination, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function GameList({ searchTerm, platformFilter }) {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage) : 1;
  });
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // Guardar la página actual en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  // Restaurar la página desde el estado de la ubicación
  useEffect(() => {
    const savedPage = location.state?.page;
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, [location.state]);

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
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    // No reiniciamos la página actual aquí
  }, [games, searchTerm, platformFilter, itemsPerPage]);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (gameId) => {
    navigate(`/games/${gameId}/edit`, { state: { page: currentPage } });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredGames.slice(startIndex, endIndex);
  };

  const renderPagination = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return (
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="d-flex align-items-center gap-2">
          <span>Mostrar:</span>
          <Form.Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{ width: '80px' }}
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={50}>50</option>
          </Form.Select>
          <span>juegos por página</span>
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {items}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </div>
    );
  };

  const renderGridView = () => (
    <Row xs={1} sm={2} md={3} lg={4} className="g-3">
      {getCurrentPageItems().map((game) => (
        <Col key={game._id}>
          <Card 
            className="h-100 game-card"
            onClick={(e) => {
              if (!e.target.closest('.btn-delete')) {
                handleCardClick(game._id);
              }
            }}
            onMouseDown={(e) => {
              if (e.button === 1 && !e.target.closest('.btn-delete')) {
                e.preventDefault();
                window.open(`/games/${game._id}/edit`, '_blank');
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="ratio ratio-16x9">
              <Card.Img 
                variant="top" 
                src={game.image} 
                style={{ 
                  objectFit: 'contain',
                  objectPosition: 'center',
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  transition: 'transform 0.3s ease-in-out'
                }} 
              />
            </div>
            <Card.Body className="d-flex flex-column p-2 p-sm-3">
              <Card.Title className="h6 text-primary fw-bold mb-1">{game.name}</Card.Title>
              <Card.Text className="small text-muted mb-2">
                <i className="bi bi-controller me-1"></i>
                {formatPlatforms(game.platform)}
              </Card.Text>
              <div className="mt-auto d-flex justify-content-end">
                <Button
                  className="btn-delete btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(game._id);
                  }}
                >
                  <i className="bi bi-trash"></i>
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
      {getCurrentPageItems().map((game) => (
        <ListGroup.Item 
          key={game._id} 
          className="d-flex flex-column flex-sm-row align-items-center game-list-item p-2"
          onClick={(e) => {
            if (!e.target.closest('.btn-delete')) {
              handleCardClick(game._id);
            }
          }}
          onMouseDown={(e) => {
            if (e.button === 1 && !e.target.closest('.btn-delete')) {
              e.preventDefault();
              window.open(`/games/${game._id}/edit`, '_blank');
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="me-0 me-sm-3 mb-2 mb-sm-0" style={{ width: '100%', maxWidth: '200px', height: '120px' }}>
            <img
              src={game.image}
              alt={game.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                transition: 'transform 0.3s ease-in-out'
              }}
            />
          </div>
          <div className="flex-grow-1 text-center text-sm-start">
            <h5 className="h6 mb-1 text-primary fw-bold">{game.name}</h5>
            <small className="text-muted">
              <i className="bi bi-controller me-1"></i>
              {formatPlatforms(game.platform)}
            </small>
          </div>
          <div className="ms-0 ms-sm-3 mt-2 mt-sm-0">
            <Button
              className="btn-delete btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(game._id);
              }}
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
    <div className="container-fluid px-3">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-3 mb-sm-0 text-primary fw-bold">
          <i className="bi bi-controller me-2"></i>
          Lista de Juegos
        </h1>
        <div className="btn-group">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('grid')}
            size="sm"
          >
            <i className="bi bi-grid-3x3-gap"></i>
            <span className="d-none d-sm-inline ms-1">Cuadrícula</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('list')}
            size="sm"
          >
            <i className="bi bi-list-ul"></i>
            <span className="d-none d-sm-inline ms-1">Lista</span>
          </Button>
        </div>
      </div>

      {filteredGames.length === 0 && (searchTerm || platformFilter) ? (
        <div className="alert alert-info">
          No se encontraron juegos con los criterios de búsqueda seleccionados
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? renderGridView() : renderListView()}
          {renderPagination()}
          <div className="text-center mt-2 text-muted small">
            Mostrando {getCurrentPageItems().length} de {filteredGames.length} juegos
            {searchTerm && ` que coinciden con "${searchTerm}"`}
            {platformFilter && ` en la plataforma ${platformFilter}`}
          </div>
        </>
      )}
    </div>
  );
}

export default GameList; 