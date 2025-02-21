// src/helpers/emailHelper.js
const transporter = require('../config/emailConfig');
const generatePDF = require('../utils/pdfGenerator');
const fs = require('fs');
const axios = require('axios');

const sendEmailWithPDF = (formData, callback) => {
    generatePDF(formData, async (err, pdfPath) => {
        if (err) {
            console.error("❌ Error generando PDF:", err);
            return callback(err, null);
        }

        try {
            const response = await axios.get('https://libroreclamaciones-552ad643df8d.herokuapp.com/api/libroReclamaciones/ID');
            const ultimoID = response.data.ultimoID;
            const formattedID = `0000-${ultimoID}`;

            console.log("📩 Enviando correo a:", formData.correo);
            console.log("📩 CC:", ["20192659@aloe.ulima.edu.pe", "info@soyalmabonita.com", "valeriabasurco@hotmail.com"]);
            console.log("📩 Asunto:", `Confirmación de Reclamo N° ${formattedID} - Alma Bonita Perú E.I.R.L.`);
            console.log("📩 Archivo adjunto:", pdfPath);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: formData.correo,
                cc: ["20192659@aloe.ulima.edu.pe", "info@soyalmabonita.com", "valeriabasurco@hotmail.com"],
                subject: `Confirmación de Reclamo N° ${formattedID} - Alma Bonita Perú E.I.R.L.`,
                text: `Le informamos que hemos recibido su reclamo con el N° ${formattedID}.`,
                attachments: [{ filename: 'HojaReclamaciones.pdf', path: pdfPath }]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("❌ Error enviando correo:", error);
                    return callback(error, null);
                }
                console.log("✅ Correo enviado:", info);
                callback(null, info);
            });
        } catch (error) {
            console.error("❌ Error obteniendo el ID:", error);
            return callback(error, null);
        }
    });
};


module.exports = sendEmailWithPDF;