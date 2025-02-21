const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = async (formData, callback) => {
    try {
        const pdfPath = path.join(__dirname, '../pdfs/reclamo.pdf');
        const doc = new PDFDocument();

        // Crear el flujo de escritura de archivo
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // Añadir contenido al PDF
        doc.fontSize(18).text('ALMA BONITA PERU E.I.R.L.', { align: 'center' });
        doc.fontSize(12).text('RUC: 20600577990', { align: 'center' });
        doc.fontSize(12).text('Dirección: Los Olivos 381- San Isidro', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text('Hoja de Reclamaciones', { align: 'center' });
        doc.moveDown();

        // Agregar los datos del formulario
        doc.fontSize(12).text(`Fecha de Registro: ${formData.fechaRegistro}`);
        doc.text(`Nombre: ${formData.nombre}`);
        doc.text(`DNI / RUC: ${formData.dni}`);
        doc.text(`Teléfono: ${formData.telefono}`);
        doc.text(`Correo Electrónico: ${formData.correo}`);
        doc.text(`Domicilio: ${formData.domicilio}`);
        doc.text(`Distrito: ${formData.distrito}`);
        doc.text(`Departamento: ${formData.departamento}`);
        doc.text(`Provincia: ${formData.provincia}`);
        doc.text(`Canal de Compra: ${formData.canalCompra}`);
        doc.text(`Producto Adquirido: ${formData.producto}`);
        doc.text(`Costo del Producto: S/ ${formData.costoProducto}`);
        doc.text(`Tipo de Reclamo: ${formData.tipoReclamo}`);
        doc.text(`Detalle del Reclamo: ${formData.detalle}`);
        doc.text(`Pedido del Consumidor: ${formData.pedido}`);
        doc.text(`Observaciones: ${formData.observaciones}`);
        doc.moveDown();

        // Finalizar el documento
        doc.end();

        // Esperar a que el PDF se guarde antes de llamar al callback
        stream.on('finish', () => {
            callback(null, pdfPath);
        });

        stream.on('error', (err) => {
            callback(err, null);
        });

    } catch (error) {
        console.error("❌ Error generando PDF con pdfkit:", error);
        callback(error);
    }
};

module.exports = generatePDF;
