import connectDB from "../../../common/lib/mongodb"
import List from "../../../common/models/todolist"

export default async function addTodoList(req, res) {
  const { name } = req.body
  if (!name) {
    res.status(400).json({ msg: "Please provide a Todo List name" })
  }
  // TODO: wrap everything on a try-catch block
  try {
    await connectDB()
  } catch (error) {
    console.log(error)
  }
  try {
    const list = await List.findOne(req.body)
    if (list) {
      res
        .status(400)
        .json({ msg: "List already exists, provide a different name" })
    }
  } catch (error) {
    console.log(error)
  }
  try {
    const list = await List.create(req.body)
    res.status(200).json(list)
  } catch (error) {
    res.status(400).json({ msg: error })
    console.log(error)
  }
}
