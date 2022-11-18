import connectDB from "../../../../lib/mongodb"
import Item from "../../../../models/todoitem"

export default async function deleteTodoItem(req, res) {
  const { itemId } = req.query
  try {
    await connectDB()
    const item = await Item.findById(itemId)
    if (!item) {
      res.status(400).json({ msg: "Item does not exists" })
      return
    }
    const update = await Item.findByIdAndUpdate(
      itemId,
      { deleted: true },
      { returnDocument: "after" }
    )
    res.status(200).json({ update })
  } catch (error) {
    res.status(400).json({ error })
  }
}
