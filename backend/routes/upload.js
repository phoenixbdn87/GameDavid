const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const path = require('path');

// Ruta para subir imágenes
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }

    // Construir la URL de la imagen
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error al subir la imagen' });
  }
});

module.exports = router; 