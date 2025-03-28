import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('MongoDB connected');
};

export default connectDB;