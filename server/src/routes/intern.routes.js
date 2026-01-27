import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { getMyProgram, getMyTask, submitTask } from '../controllers/internTask.controller.js';

const internTaskRouter = express.Router()

internTaskRouter.get('/task', authMiddleware, roleMiddleware('intern'), getMyTask)
internTaskRouter.post('/task/:taskId/submit', authMiddleware, roleMiddleware('intern'), submitTask)
internTaskRouter.get('/program', authMiddleware, roleMiddleware('intern'), getMyProgram)

export default internTaskRouter;