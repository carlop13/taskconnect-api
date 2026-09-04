// Válidar si el token es válido
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
    const secret = process.env.SECRET;
    const token = req.headers['x-access-token'];

    // Verificar si no se ha proporcionado el token
    if (!token || token === "null") {
        return res.status(403).json({ message: "No se ha proporcionado token." });
    }

    try {
        // Extraer la información del token
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;

        // Buscar el usuario en la base de datos
        const user = await User.findById(req.userId, { password: 0 });

        // Validar si el usuario existe
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Continuar con la siguiente función si el usuario existe
        next();
    } catch (error) {
        // Manejo de errores en caso de que el token sea inválido
        return res.status(401).json({ message: "Token no válido." });
    }
};
