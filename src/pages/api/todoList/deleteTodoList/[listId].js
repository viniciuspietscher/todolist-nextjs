import connectDB from "../../../../lib/mongodb"
import List from "../../../../models/todolist"

export default async function deleteTodoList(req, res) {
  const { listId } = req.query
  try {
    await connectDB()
    const list = await List.findById(listId)
    if (!list) {
      res.status(400).json({ msg: "List does not exists" })
      return
    }
    await List.findByIdAndUpdate(listId, { deleted: true })
    const deletedList = await List.findById(listId)
    res.status(200).json({ deletedList })
  } catch (error) {
    res.status(400).json({ error })
  }
}
