const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const LibroReclamacionesSchema = new mongoose.Schema({
    ID: { type: Number, unique: true }, // ID numérico autoincremental
    FechaRegistro: { type: Date, default: Date.now },
    NombreCompleto: { type: String, required: true },
    Documento: { type: String, required: true },
    Telefono: { type: String, required: true },
    Correo: { type: String, required: true },
    Domicilio: { type: String, required: true },
    Distrito: { type: String, required: true },
    Departamento: { type: String, required: true },
    Provincia: { type: String, required: true },
    Canal_Compra: { type: String, required: true },
    Producto: { type: String, required: true },
    Costo: { type: Number, required: true },
    TipoReclamo: { type: String, required: true },
    DetalleReclamo: { type: String, required: true },
    PedidoConsumidor: { type: String, required: true },
    Observacion: { type: String }
}, { timestamps: true });

// Aplicar autoincremento al campo "ID"
LibroReclamacionesSchema.plugin(AutoIncrement, { inc_field: 'ID' });

module.exports = mongoose.model('LibroReclamaciones', LibroReclamacionesSchema);
