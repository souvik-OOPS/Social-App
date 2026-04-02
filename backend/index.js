import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: "http://social-app-chi-five.vercel.app",
    credentials: true,
    methods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE']
}))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

const PORT = process.env.PORT || 5000

connectDB()
app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`)
})
