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
    console.log('Alguien accedió a /');
    res.send('Hola Mundo');
});

// Rutas con logging
app.use('/api/libroReclamaciones', (req, res, next) => {
    console.log('📌 Alguien accedió a /api/libroReclamaciones');
    next();
}, libroReclamacionesRoutes);

app.use('/api/email', (req, res, next) => {
    console.log('📌 Alguien accedió a /api/email');
    next();
}, emailRoutes);



app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));