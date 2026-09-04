import User from '../models/User.js';

export const createUser = async (req, res) => {
    try {
        const { name, lastname, email, password } = req.body;

        // Verificar si el usuario ya existe por email
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "El usuario ya fue registrado." });
        }

        // Verificar que se envíen los campos necesarios
        if (!email || !password) {
            return res.status(400).json({ message: "Se requieren email y password." });
        }

        // Crear un nuevo usuario
        const newUser = new User({
            name,
            lastname,
            email,
            password: await User.encryptPassword(password),
        });

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();

        return res.status(201).json({
            message: "Usuario creado.",
            user: savedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear usuario." });
    }
};

export const updateUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, lastname, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, lastname, email },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



// Buscar al usuario por su ID
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

