import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (err) {
    console.error("DB ERROR ❌", err.message);
    process.exit(1); //  app crash (important)
  }
};

export default connectDB;