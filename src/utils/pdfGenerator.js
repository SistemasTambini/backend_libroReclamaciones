const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generatePDF = async (formData, callback) => {
    const htmlTemplate = `
    <html><head><style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { color: #d9534f; text-align: center; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #d9534f; color: white; padding: 10px; text-align: left; }
      td { background-color: #f8f8f8; text-align: left; }
      </style></head><body>
      <h2 style='text-align: center;'>ALMA BONITA PERU E.I.R.L.</h2>
      <p style='text-align: center;'>RUC: 20600577990</p>
      <p style='text-align: center;'>Dirección: Los Olivos 381- San Isidro</p>
      <h1>Hoja de Reclamaciones</h1>
      <table>
      <tr><th>Fecha de Registro</th><td>${formData.fechaRegistro}</td></tr>
      <tr><th>Nombre</th><td>${formData.nombre}</td></tr>
      <tr><th>DNI / RUC</th><td>${formData.dni}</td></tr>
      <tr><th>Teléfono</th><td>${formData.telefono}</td></tr>
      <tr><th>Correo Electrónico</th><td>${formData.correo}</td></tr>
      <tr><th>Domicilio</th><td>${formData.domicilio}</td></tr>
      <tr><th>Distrito</th><td>${formData.distrito}</td></tr>
      <tr><th>Departamento</th><td>${formData.departamento}</td></tr>
      <tr><th>Provincia</th><td>${formData.provincia}</td></tr>
      <tr><th>Canal de Compra</th><td>${formData.canalCompra}</td></tr>
      <tr><th>Producto Adquirido</th><td>${formData.producto}</td></tr>
      <tr><th>Costo del Producto</th><td>S/ ${formData.costoProducto}</td></tr>
      <tr><th>Tipo de Reclamo</th><td>${formData.tipoReclamo}</td></tr>
      <tr><th>Detalle del Reclamo</th><td>${formData.detalle}</td></tr>
      <tr><th>Pedido del Consumidor</th><td>${formData.pedido}</td></tr>
      <tr><th>Observaciones</th><td>${formData.observaciones}</td></tr>
      </table>
      </body></html>
    `;

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || (await puppeteer.executablePath()),
        });

        const page = await browser.newPage();
        await page.setContent(htmlTemplate, { waitUntil: 'domcontentloaded' });

        const pdfPath = path.join(__dirname, '../pdfs/reclamo.pdf');
        await page.pdf({ path: pdfPath, format: 'A4' });

        await browser.close();
        callback(null, pdfPath);
    } catch (error) {
        console.error("❌ Error generando PDF con Puppeteer:", error);
        callback(error);
    }
};

module.exports = generatePDF;
