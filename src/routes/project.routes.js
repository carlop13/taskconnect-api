import { Router } from 'express';
import { createProject, getUserProjects, deleteProject, addMembersToProject, removeUserFromProject} from '../controllers/project.controller.js';
import { createTask, editTask, getProjectTasks } from '../controllers/task.controller.js';
import { verifyToken } from '../middlewares/authJwt.js';

const router = Router();

router.post('/', verifyToken, createProject); //crear un nuevo proyecto
router.post('/task', verifyToken, createTask); //agregar tareas nuevas
router.put('/task/:taskId', verifyToken, editTask); //editar tarea
router.get('/:id', verifyToken, getUserProjects); //obtener el id y nombre de los proyectos asociados al user
router.get('/task/:id', verifyToken, getProjectTasks); //obtener los datos y las tareas de un proyecto por id del mismo
router.delete('/:id', verifyToken, deleteProject); //eliminar un proyecto
router.put('/:id/members', verifyToken, addMembersToProject); // agregar miembros 
router.delete('/deletemember/:projectId/users/:userId', verifyToken, removeUserFromProject);

export default router;