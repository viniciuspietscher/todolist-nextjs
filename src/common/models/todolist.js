import { Schema, model, models } from "mongoose"

const todoListSchema = new Schema({
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

const List = models.List || model("List", todoListSchema)

export default List
