import express from 'express'
import UserRoutes from './user.routes'

const router = express.Router()

router.use("/user", UserRoutes)

export default router

