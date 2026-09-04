import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const getProjectTasks = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await Project.findById(projectId)
            .populate('leader', 'name lastname email') 
            .populate('members', 'name lastname email');

        if (!project) {
            return res.status(404).json({ message: "El proyecto no existe." });
        }

        const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name lastname email');;

        return res.status(200).json({
            project: {
                name: project.name,
                leader: project.leader,
                members: project.members,
            },
            tasks,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener las tareas del proyecto." });
    }
};



export const createTask = async (req, res) => {
    try {
        const { title, description, assignedToEmails, project } = req.body;

        if (!assignedToEmails || !Array.isArray(assignedToEmails)) {
            return res.status(400).json({ message: "Se deben proporcionar correos electrónicos para asignar usuarios." });
        }

        const foundProject = await Project.findById(project);
        if (!foundProject) {
            return res.status(400).json({ message: "El proyecto no existe." });
        }

        const users = await User.find({ email: { $in: assignedToEmails } });

        if (users.length !== assignedToEmails.length) {
            return res.status(400).json({ message: "Algunos usuarios no fueron encontrados." });
        }

        const assignedTo = users.map(user => user._id);

        const validAssignedUsers = assignedTo.filter(userId => foundProject.members.includes(userId));

        if (validAssignedUsers.length !== assignedTo.length) {
            return res.status(400).json({ message: "Algunos usuarios no son miembros del proyecto." });
        }

        const newTask = new Task({
            title,
            description,
            assignedTo: validAssignedUsers,
            project
        });

        const savedTask = await newTask.save();

        await Project.findByIdAndUpdate(project, { $push: { tasks: savedTask._id } });

        return res.status(201).json({
            message: "Tarea creada con éxito.",
            task: savedTask
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear la tarea." });
    }
};

export const editTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, assignedToEmails, status } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "La tarea no existe." });
        }

        if (assignedToEmails && Array.isArray(assignedToEmails)) {
            const users = await User.find({ email: { $in: assignedToEmails } });

            if (users.length !== assignedToEmails.length) {
                return res.status(400).json({ message: "Algunos usuarios no fueron encontrados." });
            }

            const assignedTo = users.map(user => user._id);

            const foundProject = await Project.findById(task.project);
            const validAssignedUsers = assignedTo.filter(userId => foundProject.members.includes(userId));

            if (validAssignedUsers.length !== assignedTo.length) {
                return res.status(400).json({ message: "Algunos usuarios no son miembros del proyecto." });
            }

            task.assignedTo = validAssignedUsers;
        }

        if (title) {
            task.title = title;
        }

        if (description) {
            task.description = description;
        }

        if (status) {
            task.status = status;
        }

        const updatedTask = await task.save();

        return res.status(200).json({
            message: "Tarea actualizada con éxito.",
            task: updatedTask
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al editar la tarea." });
    }
};



