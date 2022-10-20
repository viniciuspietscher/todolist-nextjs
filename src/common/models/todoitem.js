import { Schema, model, models, Types } from "mongoose"

const todoItemSchema = new Schema({
  listId: {
    type: Types.ObjectId,
    ref: "todoListSchema",
  },
  item: {
    type: String,
    required: [true, "Todo Item must have a string"],
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

const Item = models.Item || model("Item", todoItemSchema)

export default Item
