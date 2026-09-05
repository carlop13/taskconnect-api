import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user.routes.js";
import projectRoutes from "./src/routes/project.routes.js";

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: '*', // Permite todas las orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'x-access-token']
};

app.use(cors(corsOptions));



// Permitir que Express entienda formato JSON
app.use(cors(corsOptions));

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta de inicio (Health Check)
app.get('/', (req, res) => {
    res.status(200).json({
        name: "TaskConnect API",
        message: "El servidor está funcionando correctamente.",
        status: "Online",
        version: "1.0.0"
    });
});

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;