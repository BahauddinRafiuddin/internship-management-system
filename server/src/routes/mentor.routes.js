import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { createTask, getInternPerformance, getMentorDashboard, getMentorInterns, getMentorPrograms, getMentorTasks, reviewTask } from '../controllers/mentorTask.controller.js';

const mentorTaskRouter = express.Router()

mentorTaskRouter.post('/task', authMiddleware, roleMiddleware("mentor"), createTask)
mentorTaskRouter.put('/task/:taskId/review', authMiddleware, roleMiddleware('mentor'), reviewTask)
mentorTaskRouter.get('/tasks', authMiddleware, roleMiddleware('mentor'), getMentorTasks)
mentorTaskRouter.get('/dashboard', authMiddleware, roleMiddleware('mentor'), getMentorDashboard)
mentorTaskRouter.get('/programs', authMiddleware, roleMiddleware('mentor'), getMentorPrograms)
mentorTaskRouter.get('/interns', authMiddleware, roleMiddleware('mentor'), getMentorInterns)
mentorTaskRouter.get('/intern-performance', authMiddleware, roleMiddleware('mentor'), getInternPerformance)
export default mentorTaskRouter;