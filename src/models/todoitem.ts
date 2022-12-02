import mongoose, { ObjectId } from "mongoose"
import { ITodoItem } from "../lib/types"

const todoItemSchema = new mongoose.Schema<ITodoItem<ObjectId>>({
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "todoListSchema",
  },
  item: {
    type: String,
    required: [true, "Item must not be empty"],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
})

const Item =
  (mongoose.models.Item as mongoose.Model<ITodoItem<ObjectId>>) ||
  mongoose.model<ITodoItem<ObjectId>>("Item", todoItemSchema)

export default Item
