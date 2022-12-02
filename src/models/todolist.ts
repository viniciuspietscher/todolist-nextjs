import mongoose, { ObjectId } from "mongoose"
import { ITodoList } from "../lib/types"

const todoListSchema = new mongoose.Schema<ITodoList<ObjectId>>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minLength: 2,
    maxLength: 100,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
})

const List =
  (mongoose.models.List as mongoose.Model<ITodoList<ObjectId>>) ||
  mongoose.model<ITodoList<ObjectId>>("List", todoListSchema)

export default List
