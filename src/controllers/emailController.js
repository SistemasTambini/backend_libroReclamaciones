// src/controllers/emailController.js
const sendEmailWithPDF = require('../helpers/emailHelper');
const axios = require('axios');

exports.enviarCorreo = async (req, res) => {
    try {
        const formData = req.body;
        
        // Obtener el último ID del reclamo
        const response = await axios.get('https://backend-libroreclamaciones.onrender.com/api/libroReclamaciones/ID');
        const ultimoID = response.data.ultimoID;
        const formattedID = `0000-${ultimoID}`;
        formData.reclamoID = formattedID;
        formData.correo = formData.correo ? formData.correo : ""; // Dejar vacío si no hay correo

        // Definir destinatarios y copias
        const destinatarios = formData.correo ? formData.correo : "info@soyalmabonita.com,valeriabasurco@hotmail.com";
        const ccEmails = formData.correo ? ["info@soyalmabonita.com", "valeriabasurco@hotmail.com", "20192659@aloe.ulima.edu.pe"] : ["20192659@aloe.ulima.edu.pe"];

        sendEmailWithPDF({
            ...formData,
            correo: destinatarios,
            cc: ccEmails.join(',')
        }, (err, info) => {
            if (err) {
                return res.status(500).json({ message: 'Error al enviar el correo', error: err });
            }
            res.json({ message: 'Correo enviado correctamente', info });
        });
    } catch (error) {
        console.error("❌ Error al obtener el ID del reclamo:", error);
        return res.status(500).json({ message: 'Error obteniendo el ID del reclamo', error });
    }
};
