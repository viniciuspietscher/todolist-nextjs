import connectDB from "../../../lib/mongodb"
import List from "../../../models/todolist"

export default async function getTodoLists(req, res) {
  try {
    await connectDB()
    const lists = await List.find({ deleted: false }).sort({ _id: "desc" }) //get not deleted lists and sort by newest first
    res.json(lists)
  } catch (error) {
    res.json({ msg: error })
  }
}
