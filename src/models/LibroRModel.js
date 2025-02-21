const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const LibroReclamacionesSchema = new mongoose.Schema({
    ID: { type: Number, unique: true }, // ID numérico autoincremental
    FechaRegistro: { type: Date, default: Date.now },
    NombreCompleto: { type: String},
    Documento: { type: String},
    Telefono: { type: String},
    Correo: { type: String},
    Domicilio: { type: String},
    Distrito: { type: String},
    Departamento: { type: String},
    Provincia: { type: String},
    Canal_Compra: { type: String},
    Producto: { type: String},
    Costo: { type: Number},
    TipoReclamo: { type: String},
    DetalleReclamo: { type: String},
    PedidoConsumidor: { type: String},
    Observacion: { type: String }
}, { timestamps: true });

// Aplicar autoincremento al campo "ID"
LibroReclamacionesSchema.plugin(AutoIncrement, { inc_field: 'ID' });

module.exports = mongoose.model('LibroReclamaciones', LibroReclamacionesSchema);
