import connectDB from "../../../lib/mongodb"
import List from "../../../models/todolist"

export default async function addTodoList(req, res) {
  const { name } = req.body
  if (!name) {
    res.status(400).json({ msg: "Please provide a Todo List name" })
    return
  }
  try {
    await connectDB()
    const listExists = await List.findOne(req.body)
    if (listExists) {
      res
        .status(400)
        .json({ msg: "List already exists, provide a different name" })
      return
    }
    const list = await List.create(req.body)
    res.json(list)
  } catch (error) {
    res.json({ msg: error })
  }
}
