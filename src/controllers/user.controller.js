import User from '../models/User.js';
import Project from '../models/Project.js';
import nodemailer from 'nodemailer';

// CONFIGURACIÓN DE BREVO (SMTP)
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD
    }
});

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

        // 1. Buscar los proyectos donde el usuario estaba pendiente (y traer los datos del líder)
        const pendingProjects = await Project.find({ pendingMembers: email }).populate('leader', 'name lastname email');

        if (pendingProjects.length > 0) {
            // 2. Hacer la actualización masiva (mover de pendientes a oficiales)
            await Project.updateMany(
                { pendingMembers: email }, 
                { 
                    $push: { members: savedUser._id },
                    $pull: { pendingMembers: email }
                }
            );

            // 3. Enviar correo de aviso a cada líder de proyecto
            for (const project of pendingProjects) {
                if (project.leader && project.leader.email) {
                    await transporter.sendMail({
                        from: '"Taskconnect" <patiguerrero234@gmail.com>',
                        to: project.leader.email,
                        subject: `¡${name} se ha unido a tu equipo!`,
                        html: `<p>Hola ${project.leader.name},</p>
                               <p>Te avisamos que <strong>${name} ${lastname}</strong> (${email}) acaba de aceptar tu invitación y ya creó su cuenta en Taskconnect.</p>
                               <p>Ya forma parte oficial de tu proyecto <strong>${project.name}</strong>. Ya puedes ingresar a la plataforma y comenzar a asignarle tareas.</p>`
                    });
                }
            }
        }

        return res.status(201).json({
            message: "Usuario creado y asignado a sus proyectos pendientes.",
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