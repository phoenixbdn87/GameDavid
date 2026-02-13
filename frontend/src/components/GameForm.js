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
    image: '',
    futurible: false
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
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#1a1a24',
      borderColor: state.isFocused ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 212, 255, 0.2)' : 'none',
      borderRadius: '8px',
      '&:hover': {
        borderColor: '#00d4ff',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#12121a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'linear-gradient(135deg, #00d4ff, #a855f7)'
        : state.isFocused
          ? '#242430'
          : 'transparent',
      background: state.isSelected
        ? 'linear-gradient(135deg, #00d4ff, #a855f7)'
        : state.isFocused
          ? '#242430'
          : 'transparent',
      color: state.isSelected ? '#0a0a0f' : '#ffffff',
      borderRadius: '4px',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#242430',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#242430',
      borderRadius: '4px',
      border: '1px solid rgba(0, 212, 255, 0.3)',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#ffffff',
      fontWeight: 500,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#b0b0c0',
      '&:hover': {
        backgroundColor: '#ff3366',
        color: '#ffffff',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6b6b7b',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#ffffff',
    }),
    input: (provided) => ({
      ...provided,
      color: '#ffffff',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#b0b0c0',
      '&:hover': {
        color: '#00d4ff',
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: '#b0b0c0',
      '&:hover': {
        color: '#ff3366',
      },
    }),
  };

  return (
    <Card className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold" style={{ fontSize: '2.2rem' }}>
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
          <div className="mb-4">
            <Form.Label className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-image" style={{ color: '#00d4ff' }}></i>
              Vista Previa de Carátula
            </Form.Label>
            <div className="preview-container">
              <div className="preview-card">
                <div className="preview-img-wrapper">
                  <img
                    src={game.image}
                    alt="Vista previa"
                    className="preview-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'none';
                    }}
                  />
                  <div className="preview-error">
                    <i className="bi bi-exclamation-triangle"></i>
                    <span>Error al cargar imagen</span>
                  </div>
                  <div className="preview-overlay">
                    <div className="preview-badge">
                      <i className="bi bi-check-circle-fill me-1"></i>
                      Preview
                    </div>
                  </div>
                  <div className="preview-shine"></div>
                </div>
                {game.name && (
                  <div className="preview-info">
                    <span className="preview-title">{game.name}</span>
                    {game.platform.length > 0 && (
                      <span className="preview-platforms">
                        <i className="bi bi-controller me-1"></i>
                        {game.platform.join(' / ')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="futurible-check"
            label="Futurible"
            checked={game.futurible}
            onChange={(e) => setGame(prev => ({ ...prev, futurible: e.target.checked }))}
            className="futurible-switch"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {id ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
    </Card>
  );
}

export default GameForm; 