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
            const response = await axios.get('https://libroreclamaciones-552ad643df8d.herokuapp.com/api/libroReclamaciones/ID');
            const ultimoID = response.data.ultimoID;
            const formattedID = `0000-${ultimoID}`;

            console.log("📩 Enviando correo a:", formData.correo);
            console.log("📩 CC:", ["20192659@aloe.ulima.edu.pe", "info@soyalmabonita.com", "valeriabasurco@hotmail.com"]);
            console.log("📩 Asunto:", `Confirmación de Reclamo N° ${formattedID} - Alma Bonita Perú E.I.R.L.`);
            console.log("📩 Archivo adjunto:", pdfPath);

            const mailOptions = {
                from: `"Alma Bonita Perú" <${process.env.EMAIL_USER}>`,
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

                // Eliminar el archivo PDF después del envío para evitar acumulación de archivos en el servidor
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
