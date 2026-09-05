import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
dotenv.config();

const PORT = process.env.PORT || 3000;
const mongodbUri = process.env.MONGODB_URI;

// Evitar múltiples conexiones en entornos Serverless (Vercel)
if (mongoose.connection.readyState !== 1) {
    mongoose.connect(mongodbUri)
        .then(() => console.log('Conectado a la base de datos Atlas.'))
        .catch((error) => console.error('Error conectando a MongoDB:', error));
}

// Solo iniciar app.listen si NO estamos en Vercel
// Vercel inyecta automáticamente una variable de entorno para saber que estamos ahí
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log('Servicio corriendo en el puerto: ', PORT);
    });
}

// Exportar la app es obligatorio para que Vercel la pueda ejecutar
export default app;