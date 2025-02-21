// src/controllers/libroReclamacionesController.js
const LibroReclamaciones = require('../models/LibroRModel');

// Guardar un nuevo reclamo
exports.guardarLibro = async (req, res) => {
    try {
        const nuevoReclamo = new LibroReclamaciones(req.body);
        await nuevoReclamo.save();
        res.status(201).json({ message: 'Reclamo guardado exitosamente', data: nuevoReclamo });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el reclamo', error });
    }
};

// Obtener el último ID registrado
exports.obtenerUltimoID = async (req, res) => {
    try {
        const ultimoReclamo = await LibroReclamaciones.findOne().sort({ ID: -1 });
        if (!ultimoReclamo) {
            return res.status(404).json({ message: 'No hay reclamos registrados' });
        }
        res.json({ ultimoID: ultimoReclamo.ID });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el último ID', error });
    }
};

