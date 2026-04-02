import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'

dotenv.config()

const app = express()
const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://social-app-chi-five.vercel.app',
    'http://localhost:5173'
].filter(Boolean)

app.set('trust proxy', 1)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
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
