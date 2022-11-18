import connectDB from "../../../lib/mongodb"
import Item from "../../../models/todoitem"

export default async function addTodoItem(req, res) {
  const { listId, item } = req.body
  if (!listId || !item) {
    res.status(400).json({ msg: "Field must not be empty" })
    return
  }
  try {
    await connectDB()
    const item = await Item.create(req.body)
    res.status(201).json({ item })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}
