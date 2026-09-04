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
app.use(express.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//Prueba

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

export default app;
