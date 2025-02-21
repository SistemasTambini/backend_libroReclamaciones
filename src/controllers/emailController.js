// src/controllers/emailController.js
const sendEmailWithPDF = require('../helpers/emailHelper');

exports.enviarCorreo = (req, res) => {
    const formData = req.body;
    
    // Si no hay correo del usuario, enviar solo a los administradores
    const destinatarios = formData.Correo ? formData.Correo : "info@soyalmabonita.com,valeriabasurco@hotmail.com";
    const ccEmails = formData.Correo ? [] : ["20192659@aloe.ulima.edu.pe"];

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
};
