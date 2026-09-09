import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
dotenv.config();

const PORT = process.env.PORT || 3000;
const mongodbUri = process.env.MONGODB_URI;

/** 
 * ESTRATEGIA DE CONNECTION POOLING PARA VERCEL (SERVERLESS)
 * Usamos el objeto `global` para guardar la conexión en la memoria RAM 
 * del contenedor y que sobreviva entre distintas peticiones.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // 1. Si ya tenemos una conexión activa en la memoria caché, la devolvemos inmediatamente
    if (cached.conn) {
        console.log('⚡ Reutilizando conexión a MongoDB (Caché activo)');
        return cached.conn;
    }

    // 2. Si no hay conexión, pero ya hay una en proceso (promesa), esperamos a que termine
    if (!cached.promise) {
        console.log('⏳ Creando nueva conexión a MongoDB...');
        
        // Configuramos la piscina de conexiones (Pool)
        const opts = {
            maxPoolSize: 10 // Límite estricto para no asustar al plan gratuito de Atlas
        };

        cached.promise = mongoose.connect(mongodbUri, opts).then((mongoose) => {
            return mongoose;
        });
    }
    
    // 3. Resolvemos la promesa y guardamos la conexión definitiva
    try {
        cached.conn = await cached.promise;
        console.log('✅ Conectado a MongoDB Atlas exitosamente');
    } catch (error) {
        cached.promise = null; // Si falla, borramos la promesa para que el siguiente intento arranque de cero
        console.error('❌ Error conectando a MongoDB:', error);
    }

    return cached.conn;
}

// Iniciar la conexión en cuanto arranca el contenedor de Vercel
connectDB();

// Solo iniciar app.listen si NO estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servicio corriendo en el puerto: ${PORT}`);
    });
}

// Exportar la app es obligatorio para que Vercel la pueda enrutar
export default app;