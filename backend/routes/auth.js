const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Credenciales desde variables de entorno
  const validUsername = process.env.AUTH_USERNAME || 'phoenix';
  const validPassword = process.env.AUTH_PASSWORD || 'phoenix';

  if (username === validUsername && password === validPassword) {
    res.json({
      success: true,
      message: 'Login exitoso',
      user: { username }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales incorrectas'
    });
  }
});

// POST /api/auth/verify - Verificar si la sesión es válida
router.post('/verify', (req, res) => {
  const { username } = req.body;

  if (username) {
    res.json({ success: true, valid: true });
  } else {
    res.status(401).json({ success: false, valid: false });
  }
});

module.exports = router;
