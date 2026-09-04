// MODELOS DE USUARIO
import User from "../models/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const secret = process.env.SECRET;

// FUNCIÓN PARA INICIAR SESIÓN
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Por favor, proporciona correo electrónico y contraseña." });
        }

        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(400).json({ message: "El usuario no existe." });
        }

        const matchPassword = await User.comparePassword(password, userFound.password);

        if (!matchPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        const token = tokenGenerate(userFound);

        res.status(200).json({ token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};

function tokenGenerate(userFound) {
    return jwt.sign(
        { id: userFound._id, name: userFound.name, lastname: userFound.lastname },
        secret, 
        { expiresIn: 86400 }
    );
}
