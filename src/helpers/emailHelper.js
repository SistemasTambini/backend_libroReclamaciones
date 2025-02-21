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
            // Obtener el último ID del reclamo desde la API
            const response = await axios.get('https://backend-libroreclamaciones.onrender.com/api/libroReclamaciones/ID');
            const ultimoID = response.data.ultimoID;
            const formattedID = `0000-${ultimoID}`;
            formData.reclamoID = formattedID; // Agregar el ID al PDF
            formData.correo = formData.correo ? formData.correo : ""; // Si no hay correo, dejarlo vacío en el PDF

            // Definir destinatarios y copias
            let destinatarios;
            let ccEmails = ["info@soyalmabonita.com", "valeriabasurco@hotmail.com", "20192659@aloe.ulima.edu.pe"];

            if (formData.correo && formData.correo.trim() !== "") {
                // Si el usuario ingresó su correo, él es el destinatario y los demás van en CC
                destinatarios = formData.correo;
            } else {
                // Si no ingresó correo, enviar a los administradores
                destinatarios = "info@soyalmabonita.com,valeriabasurco@hotmail.com";
                ccEmails = ["20192659@aloe.ulima.edu.pe"];
            }

            const mailOptions = {
                from: `Alma Bonita Perú <${process.env.EMAIL_USER}>`,
                to: destinatarios,
                cc: ccEmails.join(','),
                subject: `Confirmación de Reclamo N° ${formattedID} - Alma Bonita Perú E.I.R.L.`,
                text: `Le informamos que hemos recibido su reclamo con el N° ${formattedID}. \n\nAdjunto encontrará la confirmación de su reclamo con todos los detalles.\n\nSi tiene alguna consulta, por favor contáctenos a través de los siguientes medios:\n\n📞 Teléfono / Whatsapp: +51 989 356 142\n📧 Email: info@soyalmabonita.com\n\nAtentamente,\nAlma Bonita Perú E.I.R.L.\nÁrea de Atención al Cliente`,
                attachments: [
                    {
                        filename: 'HojaReclamaciones.pdf',
                        path: pdfPath,
                        contentType: 'application/pdf'
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("❌ Error enviando correo:", error);
                    return callback(error, null);
                }

                console.log("✅ Correo enviado con éxito:", info.response);

                // Eliminar el archivo PDF después del envío para evitar acumulación de archivos
                fs.unlink(pdfPath, (err) => {
                    if (err) console.error("⚠️ No se pudo eliminar el PDF:", err);
                    else console.log("🗑️ PDF eliminado del servidor:", pdfPath);
                });

                callback(null, info);
            });

        } catch (error) {
            console.error("❌ Error obteniendo el ID:", error);
            return callback(error, null);
        }
    });
};

module.exports = sendEmailWithPDF;
