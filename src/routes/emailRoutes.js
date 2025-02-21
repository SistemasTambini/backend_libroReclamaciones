// src/routes/emailRoutes.js
const express = require('express');
const { enviarCorreo } = require('../controllers/emailController');
const router = express.Router();

router.post('/', enviarCorreo);

module.exports = router;