const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Obtener todos los videojuegos
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un videojuego por ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Videojuego no encontrado' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo videojuego
router.post('/', async (req, res) => {
  const game = new Game({
    name: req.body.name,
    description: req.body.description,
    platform: req.body.platform,
    image: req.body.image
  });

  try {
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar un videojuego
router.put('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Videojuego no encontrado' });

    game.name = req.body.name || game.name;
    game.description = req.body.description || game.description;
    game.platform = req.body.platform || game.platform;
    game.image = req.body.image || game.image;

    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un videojuego
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Videojuego no encontrado' });

    await game.deleteOne();
    res.json({ message: 'Videojuego eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 