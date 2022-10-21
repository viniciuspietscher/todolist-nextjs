import mongoose from "mongoose"

const todoItemSchema = new mongoose.Schema({
  listId: {
    type: mongoose.Types.ObjectId,
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

const Item = mongoose.models.Item || mongoose.model("Item", todoItemSchema)

export default Item
