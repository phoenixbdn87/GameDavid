const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const Game = require('../models/Game');

// GET /api/export/excel - Exportar todos los juegos a Excel
router.get('/excel', async (req, res) => {
  try {
    // Obtener todos los juegos ordenados alfabéticamente
    const games = await Game.find().sort({ name: 1 });

    // Preparar datos para Excel
    const data = games.map(game => ({
      'Nombre': game.name,
      'Plataformas': Array.isArray(game.platform)
        ? game.platform.join(', ')
        : game.platform
    }));

    // Crear workbook y worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Ajustar ancho de columnas
    worksheet['!cols'] = [
      { wch: 50 }, // Nombre
      { wch: 30 }  // Plataformas
    ];

    // Añadir worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Juegos');

    // Generar buffer del archivo Excel
    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx'
    });

    // Configurar headers para descarga
    const fecha = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Disposition', `attachment; filename=catalogo_juegos_${fecha}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Enviar archivo
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error exportando a Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Error al exportar el catálogo'
    });
  }
});

module.exports = router;
