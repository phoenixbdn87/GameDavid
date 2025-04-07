const Game = require('../models/Game');

// Obtener todos los juegos
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ name: 1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un juego por ID
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo juego
exports.createGame = async (req, res) => {
  try {
    // Asegurarse de que platform sea un array
    const gameData = {
      ...req.body,
      platform: Array.isArray(req.body.platform) ? req.body.platform : [req.body.platform]
    };

    const game = new Game(gameData);
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un juego
exports.updateGame = async (req, res) => {
  try {
    // Asegurarse de que platform sea un array
    const gameData = {
      ...req.body,
      platform: Array.isArray(req.body.platform) ? req.body.platform : [req.body.platform]
    };

    const game = await Game.findByIdAndUpdate(
      req.params.id,
      gameData,
      { new: true, runValidators: true }
    );
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un juego
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json({ message: 'Juego eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 