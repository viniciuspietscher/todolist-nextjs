import mongoose from "mongoose"

const todoListSchema = new mongoose.Schema({
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

const List = mongoose.models.List || mongoose.model("List", todoListSchema)

export default List
