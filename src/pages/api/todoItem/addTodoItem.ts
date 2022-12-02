import connectDB from "../../../lib/mongodb"
import Item from "../../../models/todoitem"
import { NextApiRequest, NextApiResponse } from "next"

export default async function addTodoItem(req: NextApiRequest, res: NextApiResponse) {
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
    res.status(400).json({ error })
  }
}
