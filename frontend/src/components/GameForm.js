import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (id) {
      fetchGame();
    }
  }, [id]);

  const fetchGame = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/games/${id}`);
      const gameData = {
        ...response.data,
        platform: Array.isArray(response.data.platform) ? response.data.platform : [response.data.platform]
      };
      setGame(gameData);
    } catch (error) {
      console.error('Error fetching game:', error);
    }
  };

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
        await axios.put(`http://localhost:5000/api/games/${id}`, gameData);
      } else {
        await axios.post('http://localhost:5000/api/games', gameData);
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
      <h2 className="mb-4">{id ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Juego</Form.Label>
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
          <Form.Label>URL de la Imagen</Form.Label>
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
            <div className="ratio ratio-16x9">
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