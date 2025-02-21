// src/utils/pdfGenerator.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = async (formData, callback) => {
    try {
        const pdfPath = path.join(__dirname, '../pdfs/reclamo.pdf');
        const doc = new PDFDocument({ margin: 20 });

        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        doc.fontSize(18).fillColor('#d9534f').text('ALMA BONITA PERU E.I.R.L.', { align: 'center' });
        doc.fontSize(12).fillColor('black').text('RUC: 20600577990', { align: 'center' });
        doc.text('Dirección: Los Olivos 381- San Isidro', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).fillColor('#d9534f').text('Hoja de Reclamaciones', { align: 'center' });
        doc.moveDown();

        const drawRow = (y, key, value) => {
            doc.fillColor('#d9534f').fontSize(12).text(key, 50, y, { width: 200, bold: true });
            doc.fillColor('black').fontSize(12).text(value, 250, y, { width: 300 });
            doc.moveTo(50, y + 20).lineTo(550, y + 20).strokeColor('#ddd').stroke();
        };

        let y = doc.y;
        drawRow(y, 'N° de Reclamo:', formData.reclamoID);
        drawRow(y += 25, 'Fecha de Registro:', formData.fechaRegistro);
        drawRow(y += 25, 'Nombre:', formData.nombre);
        drawRow(y += 25, 'DNI / RUC:', formData.dni);
        drawRow(y += 25, 'Teléfono:', formData.telefono);
        drawRow(y += 25, 'Correo Electrónico:', formData.correo || "");
        drawRow(y += 25, 'Domicilio:', formData.domicilio);
        drawRow(y += 25, 'Distrito:', formData.distrito);
        drawRow(y += 25, 'Departamento:', formData.departamento);
        drawRow(y += 25, 'Provincia:', formData.provincia);
        drawRow(y += 25, 'Canal de Compra:', formData.canalCompra);
        drawRow(y += 25, 'Producto Adquirido:', formData.producto);
        drawRow(y += 25, 'Costo del Producto:', `S/ ${formData.costoProducto}`);
        drawRow(y += 25, 'Tipo de Reclamo:', formData.tipoReclamo);
        drawRow(y += 25, 'Detalle del Reclamo:', formData.detalle);
        drawRow(y += 25, 'Pedido del Consumidor:', formData.pedido);
        drawRow(y += 25, 'Observaciones:', formData.observaciones);

        doc.end();
        stream.on('finish', () => callback(null, pdfPath));
        stream.on('error', (err) => callback(err, null));

    } catch (error) {
        console.error("❌ Error generando PDF:", error);
        callback(error);
    }
};

module.exports = generatePDF;
