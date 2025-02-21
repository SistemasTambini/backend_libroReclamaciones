// src/helpers/emailHelper.js
const transporter = require('../config/emailConfig');
const generatePDF = require('../utils/pdfGenerator');
const fs = require('fs');
const axios = require('axios');

const sendEmailWithPDF = (formData, callback) => {
    generatePDF(formData, async (err, pdfPath) => {
        if (err) {
            return callback(err, null);
        }

        // Obtener el último ID desde el endpoint
        try {
            const response = await axios.get('http://192.168.1.200:5000/api/libroReclamaciones/ID');
            const ultimoID = response.data.ultimoID;
            const formattedID = `0000-${ultimoID}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: formData.correo,
                cc: ["20192659@aloe.ulima.edu.pe", "info@soyalmabonita.com", "valeriabasurco@hotmail.com"],
                subject: `Confirmación de Reclamo N° ${formattedID} - Alma Bonita Perú E.I.R.L.`,
                text: `Le informamos que hemos recibido su reclamo con el N° ${formattedID}.

Adjunto encontrará la confirmación de su reclamo con todos los detalles.

Si tiene alguna consulta, por favor contáctenos a través de los siguientes medios:

📞 Teléfono / Whatsapp: +51 989 356 142
📧 Email: info@soyalmabonita.com

Atentamente,
Alma Bonita Perú E.I.R.L.
Área de Atención al Cliente`,
                attachments: [{
                    filename: 'HojaReclamaciones.pdf',
                    path: pdfPath
                }]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return callback(error, null);
                }
                callback(null, info);
            });
        } catch (error) {
            return callback(error, null);
        }
    });
};

module.exports = sendEmailWithPDF;