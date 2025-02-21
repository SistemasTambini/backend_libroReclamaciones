// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/config');
const libroReclamacionesRoutes = require('./src/routes/LibroRoutes');
const emailRoutes = require('./src/routes/emailRoutes')

// Configurar dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api/libroReclamaciones', libroReclamacionesRoutes);
app.use('/api/email', emailRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));