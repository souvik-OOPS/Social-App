import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'

dotenv.config()

const app = express()
const CLIENT_URL = process.env.CLIENT_URL || 'https://social-app-chi-five.vercel.app'

app.use(cors({
    origin: CLIENT_URL,
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
