const sendEmailWithPDF = require('../helpers/emailHelper');

exports.enviarCorreo = (req, res) => {
    const formData = req.body;
    sendEmailWithPDF(formData, (err, info) => {
        if (err) {
            return res.status(500).json({ message: 'Error al enviar el correo', error: err });
        }
        res.json({ message: 'Correo enviado correctamente', info });
    });
};