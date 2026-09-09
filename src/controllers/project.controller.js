import Project from '../models/Project.js';
import User from '../models/User.js';
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

export const addMembersToProject = async (req, res) => {
    const { id } = req.params; 
    const { members } = req.body; 

    try {
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Proyecto no encontrado." });
        }

        const users = await User.find({ email: { $in: members } });

        if (users.length === 0) {
            return res.status(404).json({ message: "No se encontraron usuarios con los correos electrónicos proporcionados." });
        }

        const userIds = users.map(user => user._id);
        project.members = [...new Set([...project.members, ...userIds])];

        await project.save();

        return res.status(200).json({ message: "Miembros agregados al proyecto con éxito.", project });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al agregar miembros al proyecto." });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.params; 

    try {
        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ message: "Proyecto no encontrado." });
        }

        return res.status(200).json({ message: "Proyecto eliminado con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar el proyecto." });
    }
};

export const getUserProjects = async (req, res) => {
    try {
        const userId = req.params.id; 

        // Súper consulta: Extrae los proyectos y TODO su contenido anidado en una sola llamada
        const projects = await Project.find({ 
            $or: [
                { members: userId }, 
                { leader: userId }
            ]
        })
        .populate('leader', 'name lastname email')
        .populate('members', 'name lastname email')
        .populate({
            path: 'tasks',
            populate: {
                path: 'assignedTo',
                select: 'name lastname email'
            }
        });

        if (projects.length === 0) {
            return res.status(200).json({ message: "No se encontraron proyectos para este usuario.", projects: [] });
        }

        return res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener los proyectos." });
    }
};

export const createProject = async (req, res) => {
    try {
        const { name, description, members, leader } = req.body;

        const leaderUser = await User.findOne({ email: leader });
        if (!leaderUser) {
            return res.status(400).json({ message: "El líder del proyecto no existe." });
        }

        const existingUsers = await User.find({ email: { $in: members } });
        const existingEmails = existingUsers.map(user => user.email);
        const unregisteredEmails = members.filter(email => !existingEmails.includes(email));
        
        const memberIds = existingUsers.map(user => user._id);

        const newProject = new Project({
            name,
            description,
            members: memberIds,           
            pendingMembers: unregisteredEmails, 
            leader: leaderUser._id
        });

        const savedProject = await newProject.save();
        const leaderFullName = `${leaderUser.name} ${leaderUser.lastname}`;

        for (const email of existingEmails) {
            await transporter.sendMail({
                from: '"Taskconnect" <patiguerrero234@gmail.com>',
                to: email,
                subject: `Te han agregado al proyecto: ${name}`,
                html: `<p>Hola,</p>
                       <p><strong>${leaderFullName}</strong> te ha agregado al proyecto <strong>${name}</strong> en Taskconnect.</p>
                       <p><a href="https://taskconnect-delta.vercel.app">Entra a la web</a> y comienza a colaborar con tu equipo.</p>`
            });
        }

        for (const email of unregisteredEmails) {
            await transporter.sendMail({
                from: '"Taskconnect" <patiguerrero234@gmail.com>',
                to: email,
                subject: `Invitación al proyecto: ${name}`,
                html: `<p>Hola,</p>
                       <p><strong>${leaderFullName}</strong> te ha agregado al proyecto <strong>${name}</strong>, pero notamos que aún no tienes cuenta en Taskconnect.</p>
                       <p><a href="https://taskconnect-delta.vercel.app/registro">Haz clic aquí para registrarte</a> y comenzar a colaborar con tu equipo.</p>`
            });
        }

        return res.status(201).json({
            message: "Proyecto creado y notificaciones enviadas con éxito.",
            project: savedProject
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear el proyecto." });
    }
};


export const removeUserFromProject = async (req, res) => {
    const { projectId, userId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Proyecto no encontrado." });
        }

        if (project.leader === userId) {
            await Project.findByIdAndDelete(projectId);
            return res.status(200).json({ message: "Proyecto eliminado porque el líder fue eliminado." });
        }

        const memberIndex = project.members.indexOf(userId);
        if (memberIndex > -1) {
            project.members.splice(memberIndex, 1);
        }

        if (project.members.length === 0) {
            await Project.findByIdAndDelete(projectId);
            return res.status(200).json({ message: "Proyecto eliminado porque no quedan miembros." });
        }

        await project.save();

        return res.status(200).json({ message: "Usuario eliminado del proyecto con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar al usuario del proyecto." });
    }
};