import mongoose from "mongoose"

const connectDB = async () => {
  if (!process.env.MONGODB_URI2) {
    throw new Error('Invalid environment variable: "MONGODB_URI"')
  }
  mongoose.connect(process.env.MONGODB_URI2)
}

export default connectDB
