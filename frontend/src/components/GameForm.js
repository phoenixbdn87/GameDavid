import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const platformOptions = [
  { value: 'PS5', label: 'PS5' },
  { value: 'Switch', label: 'Nintendo Switch' },
  { value: 'Xbox', label: 'Xbox' },
  { value: 'Steam', label: 'Steam' }
];

function GameForm() {
  const [game, setGame] = useState({
    name: '',
    platform: [],
    image: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchGame = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/games/${id}`);
      const gameData = {
        ...response.data,
        platform: Array.isArray(response.data.platform) ? response.data.platform : [response.data.platform]
      };
      setGame(gameData);
    } catch (error) {
      console.error('Error fetching game:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchGame();
    }
  }, [id, fetchGame]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (selectedOptions) => {
    setGame(prev => ({
      ...prev,
      platform: selectedOptions.map(option => option.value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gameData = {
        ...game,
        platform: Array.isArray(game.platform) ? game.platform : [game.platform]
      };

      if (id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/games/${id}`, gameData);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/games`, gameData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving game:', error);
      alert('Error al guardar el juego: ' + (error.response?.data?.message || error.message));
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#ced4da',
      '&:hover': {
        borderColor: '#80bdff',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e9ecef',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#495057',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#6c757d',
      '&:hover': {
        backgroundColor: '#dc3545',
        color: 'white',
      },
    }),
  };

  return (
    <Card className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-primary fw-bold" style={{ fontSize: '2.2rem' }}>
          <i className="bi bi-controller me-2"></i>
          {id ? 'Editar Juego' : 'Nuevo Juego'}
        </h2>
        <Button
          variant="outline-secondary"
          onClick={() => navigate(-1)}
          className="d-flex align-items-center gap-2"
        >
          <i className="bi bi-arrow-left"></i>
          Volver
        </Button>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={game.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Plataformas</Form.Label>
          <Select
            isMulti
            name="platform"
            options={platformOptions}
            value={platformOptions.filter(option => game.platform.includes(option.value))}
            onChange={handlePlatformChange}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={customStyles}
            placeholder="Selecciona las plataformas..."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL de carátula</Form.Label>
          <Form.Control
            type="url"
            name="image"
            value={game.image}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {game.image && (
          <div className="mb-3">
            <Form.Label>Vista Previa</Form.Label>
            <div className="ratio ratio-16x9" style={{ maxWidth: '300px' }}>
              <img
                src={game.image}
                alt="Vista previa"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
          </div>
        )}

        <Button variant="primary" type="submit">
          {id ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
    </Card>
  );
}

export default GameForm; 