import mongoose from "mongoose"

if (!process.env.MONGODB_URI2) {
  throw new Error('Invalid environment variable: "MONGODB_URI"')
}

const connectDB = async () => {
  mongoose.connect(process.env.MONGODB_URI2)
}

export default connectDB
