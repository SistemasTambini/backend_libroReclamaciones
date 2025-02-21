const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = async (formData, callback) => {
    try {
        const pdfPath = path.join(__dirname, '../pdfs/reclamo.pdf');
        const doc = new PDFDocument({ margin: 20 });

        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // Encabezado
        doc.fontSize(18).fillColor('#d9534f').text('ALMA BONITA PERU E.I.R.L.', { align: 'center' });
        doc.fontSize(12).fillColor('black').text('RUC: 20600577990', { align: 'center' });
        doc.text('Dirección: Los Olivos 381- San Isidro', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).fillColor('#d9534f').text('Hoja de Reclamaciones', { align: 'center' });
        doc.moveDown();

        // Función para dibujar filas con más espacio cuando sea necesario
        const drawRow = (y, key, value, extraHeight = 0) => {
            const keyWidth = 180;
            const valueWidth = 350;
            const rowHeight = 25 + extraHeight; // Ajusta altura según contenido

            doc.fillColor('#d9534f').fontSize(12).text(key, 50, y, { width: keyWidth, bold: true });
            doc.fillColor('black').fontSize(12).text(value, 250, y, { width: valueWidth });

            // Línea divisoria
            doc.moveTo(50, y + rowHeight).lineTo(550, y + rowHeight).strokeColor('#ddd').stroke();

            return y + rowHeight; // Devuelve la nueva posición Y
        };

        let y = doc.y;
        y = drawRow(y, 'N° de Reclamo:', formData.reclamoID);
        y = drawRow(y, 'Fecha de Registro:', formData.fechaRegistro);
        y = drawRow(y, 'Nombre:', formData.nombre);
        y = drawRow(y, 'DNI / RUC:', formData.dni);
        y = drawRow(y, 'Teléfono:', formData.telefono);
        y = drawRow(y, 'Correo Electrónico:', formData.correo || "");
        y = drawRow(y, 'Domicilio:', formData.domicilio);
        y = drawRow(y, 'Distrito:', formData.distrito);
        y = drawRow(y, 'Departamento:', formData.departamento);
        y = drawRow(y, 'Provincia:', formData.provincia);
        y = drawRow(y, 'Canal de Compra:', formData.canalCompra);
        y = drawRow(y, 'Producto Adquirido:', formData.producto);
        y = drawRow(y, 'Costo del Producto:', `S/ ${formData.costoProducto}`);

        // Aumentamos el espacio para evitar cruces en textos largos
        y = drawRow(y, 'Tipo de Reclamo:', formData.tipoReclamo, 10); // Extra espacio
        y = drawRow(y, 'Detalle del Reclamo:', formData.detalle, 30); // Más espacio
        y = drawRow(y, 'Pedido del Consumidor:', formData.pedido, 10);
        y = drawRow(y, 'Observaciones:', formData.observaciones);

        // Finalizar documento
        doc.end();
        stream.on('finish', () => callback(null, pdfPath));
        stream.on('error', (err) => callback(err, null));

    } catch (error) {
        console.error("❌ Error generando PDF:", error);
        callback(error);
    }
};

module.exports = generatePDF;
