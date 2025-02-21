const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Lima' // Ajustar a la zona horaria de Perú
    });
};

const generatePDF = async (formData, callback) => {
    try {
        const pdfPath = path.join(__dirname, '../pdfs/reclamo.pdf');
        const doc = new PDFDocument({ margin: 50 });

        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // Encabezado
        doc.fontSize(18).fillColor('#d9534f').text('ALMA BONITA PERU E.I.R.L.', { align: 'center' });
        doc.fontSize(12).fillColor('black').text('RUC: 20600577990', { align: 'center' });
        doc.text('Dirección: Los Olivos 381- San Isidro', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).fillColor('#d9534f').text('Hoja de Reclamaciones', { align: 'center' });
        doc.moveDown();

        // Función para dibujar filas con ajuste de texto
        const drawRow = (y, key, value, options = {}) => {
            const keyWidth = 140;
            const valueWidth = 350;
            const lineHeight = 18;

            const textLines = doc.heightOfString(value, { width: valueWidth }) / lineHeight;
            const rowHeight = Math.max(25, textLines * lineHeight + 5);

            doc.fillColor('#d9534f').fontSize(12).text(key, 50, y, { width: keyWidth, bold: true });
            doc.fillColor('black').fontSize(12).text(value, 200, y, { width: valueWidth, align: 'left' });

            doc.moveTo(50, y + rowHeight).lineTo(550, y + rowHeight).strokeColor('#ddd').stroke();

            return y + rowHeight;
        };

        let y = doc.y;
        y = drawRow(y, 'N° de Reclamo:', formData.reclamoID);
        y = drawRow(y, 'Fecha y hora de Registro:', formatDate(formData.fechaRegistro)); // 🔥 Formatear fecha
        y = drawRow(y, 'Nombre:', formData.nombre);
        y = drawRow(y, 'DNI / RUC:', formData.dni);
        y = drawRow(y, 'Teléfono:', formData.telefono);
        y = drawRow(y, 'Correo Electrónico:', formData.correo || "");
        y = drawRow(y, 'Dirección completa:', formData.domicilio);
        y = drawRow(y, 'Distrito:', formData.distrito);
        y = drawRow(y, 'Departamento:', formData.departamento);
        y = drawRow(y, 'Provincia:', formData.provincia);
        y = drawRow(y, 'Canal de Compra:', formData.canalCompra);
        y = drawRow(y, 'Producto Adquirido:', formData.producto);
        y = drawRow(y, 'Costo del Producto:', `S/ ${formData.costoProducto}`);

        y = drawRow(y, 'Tipo de Reclamo:', formData.tipoReclamo, { multiline: true });
        y = drawRow(y, 'Detalle del Reclamo:', formData.detalle, { multiline: true });
        y = drawRow(y, 'Pedido del Consumidor:', formData.pedido, { multiline: true });
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
