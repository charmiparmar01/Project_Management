import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/database/connection';
import apiRoutes from './src/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors());
app.use(cors({
  origin: "*", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
