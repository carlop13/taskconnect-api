import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
dotenv.config();


//DECLARAR VARIABLES DEL PUERTO Y LA BASE DE DATOS
const PORT = process.env.PORT || 3000;
const mongodbUri = process.env.MONGODB_URI || "nada";

//INICIAR EL SERVIDOR
app.listen(PORT);

//CONECTAR A LA BASE DE DATOS DE MONGO ATLAS
mongoose.connect(mongodbUri)
    .then(() => console.log('Conectado a la base de datos Atlas.'))
    .catch((error) => console.error(error));

console.log('Servicio correindo en el puerto: ',PORT);