import Project from '../models/Project.js';
import User from '../models/User.js';

export const addMembersToProject = async (req, res) => {
    const { id } = req.params; // Obtener el ID del proyecto desde los parámetros de la solicitud
    const { members } = req.body; // Obtener la lista de nuevos miembros del cuerpo de la solicitud

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
    const { id } = req.params; // Obtener el ID del proyecto desde los parámetros de la solicitud

    try {
        // Buscar y eliminar el proyecto
        const deletedProject = await Project.findByIdAndDelete(id);

        // Verificar si el proyecto existía
        if (!deletedProject) {
            return res.status(404).json({ message: "Proyecto no encontrado." });
        }

        // Devolver una respuesta exitosa
        return res.status(200).json({ message: "Proyecto eliminado con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar el proyecto." });
    }
};

export const getUserProjects = async (req, res) => {
    try {
        const userId = req.params.id; 

        const projects = await Project.find({ 
            $or: [
                { members: userId }, 
                { leader: userId }
            ]
        }).select('name');

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

        const memberUsers = await User.find({ email: { $in: members } });
        const leaderUser = await User.findOne({ email: leader });

        if (memberUsers.length !== members.length || !leaderUser) {
            return res.status(400).json({ message: "Algunos usuarios o el líder no fueron encontrados." });
        }

        const memberIds = memberUsers.map(user => user._id);

        const newProject = new Project({
            name,
            description,
            members: memberIds, 
            leader: leaderUser._id
        });

        const savedProject = await newProject.save();

        return res.status(201).json({
            message: "Proyecto creado con éxito.",
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

