import connectDB from "../../../../lib/mongodb"
import Item from "../../../../models/todoitem"

export default async function updateTodoItem(req, res) {
  const { itemId } = req.query
  try {
    await connectDB()
    const item = await Item.findById(itemId)
    if (!item) {
      res.status(400).json({ msg: "Item does not exists" })
      return
    }
    if (item.completed) {
      await Item.findByIdAndUpdate(itemId, { completed: false })
    } else {
      await Item.findByIdAndUpdate(itemId, { completed: true })
    }
    const completedItem = await Item.findById(itemId)
    res.status(200).json({ completedItem })
  } catch (error) {
    res.status(400).json({ error })
  }
}
