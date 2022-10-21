import connectDB from "../../../lib/mongodb"
import List from "../../../models/todolist"

export default async function getTodoLists(req, res) {
  try {
    await connectDB()
    const lists = await List.find({ deleted: false }) //get not deleted lists
    res.json(lists)
  } catch (error) {
    res.json({ msg: error.message })
  }
}
