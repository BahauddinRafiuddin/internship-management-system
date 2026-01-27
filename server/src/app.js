import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRotes.js'
import adminRouter from './routes/adminRoutes.js'
import mentorTaskRouter from './routes/mentor.routes.js'
import internTaskRouter from './routes/intern.routes.js'
import performanceRouter from './routes/performance.routes.js'
import certificateRouter from './routes/certificate.routes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth',authRouter)
app.use('/api/admin',adminRouter)
app.use('/api/mentor',mentorTaskRouter)
app.use('/api/intern',internTaskRouter)
app.use('/api/performance',performanceRouter)
app.use('/api/certificate',certificateRouter)

export default app;