import connectDB from "../../../../lib/mongodb"
import Item from "../../../../models/todoitem"
import List from "../../../../models/todolist"

export default async function getTodoItems(req, res) {
  const { listId } = req.query
  try {
    await connectDB()
    const list = await List.findById(listId)
    if (!list) {
      res.status(400).json({ msg: "List does not exists" })
      return
    }
    const items = await Item.find({ listId: listId, deleted: false }).sort({
      _id: "desc",
    })
    res.status(200).json({ items })
  } catch (error) {
    res.status(400).json({ error })
  }
}
