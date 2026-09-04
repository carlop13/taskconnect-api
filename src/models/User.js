import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false, 
        unique: true, 
        sparse: true, 
    },
    password: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

// Método para encriptar la contraseña
userSchema.statics.encryptPassword = async (password) => {
    // Genera un salt para encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    // Retornar la contraseña encriptada
    return await bcrypt.hash(password, salt);
    
};

// Método para comparar la contraseña del usuario con la contraseña encriptada
userSchema.statics.comparePassword = async (password, receivedPassword) => {
    // Comparar la contraseña enviada con la contraseña encriptada
    return await bcrypt.compare(password, receivedPassword);
};

export default model('User', userSchema);
