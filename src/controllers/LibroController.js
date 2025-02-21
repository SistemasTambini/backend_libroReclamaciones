// src/controllers/libroReclamacionesController.js
const LibroReclamaciones = require('../models/LibroRModel');

// Guardar un nuevo reclamo
exports.guardarLibro = async (req, res) => {
    try {
        // Mapear los nombres de los campos
        const reclamoData = {
            FechaRegistro: req.body.fechaRegistro || new Date(),
            NombreCompleto: req.body.nombre,
            Documento: req.body.dni,
            Telefono: req.body.telefono,
            Correo: req.body.correo,
            Domicilio: req.body.domicilio,
            Distrito: req.body.distrito,
            Departamento: req.body.departamento,
            Provincia: req.body.provincia,
            Canal_Compra: req.body.canalCompra,
            Producto: req.body.producto,
            Costo: req.body.costoProducto,
            TipoReclamo: req.body.tipoReclamo,
            DetalleReclamo: req.body.detalle,
            PedidoConsumidor: req.body.pedido,
            Observacion: req.body.observaciones
        };

        const nuevoReclamo = new LibroReclamaciones(reclamoData);
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
