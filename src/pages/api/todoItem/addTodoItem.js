import connectDB from "../../../common/lib/mongodb"
import Item from "../../../common/models/todoitem"

export default async function addTodoItem(req, res) {
  const { listId, item } = req.body
  req.send(200).json(listId, item)
}
