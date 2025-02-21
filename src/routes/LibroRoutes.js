// src/routes/libroReclamacionesRoutes.js
const express = require('express');
const { guardarLibro, obtenerUltimoID } = require('../controllers/LibroController');
const router = express.Router();

router.post('/', guardarLibro);
router.get('/ID', obtenerUltimoID);

module.exports = router;

