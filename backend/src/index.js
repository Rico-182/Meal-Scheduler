import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import mealRoutes from './routes/meal.route.js';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// app.options('*', cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));
app.use('/api/auth', authRoutes);
app.use('/api/meal', mealRoutes);




app.get('/', (req, res) => {
  res.send('YMeals backend is live!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Couldn't connect to MongoDB: ", error.message);
  }
});