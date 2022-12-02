import connectDB from "../../../lib/mongodb"
import List from "../../../models/todolist"
import { NextApiRequest, NextApiResponse } from "next"

export default async function addTodoList(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.body
  if (!name) {
    res.status(400).json({ msg: "Please provide a Todo List name" })
    return
  }
  try {
    await connectDB()
    const listExists = await List.findOne(req.body)
    if (listExists) {
      res.status(400).json({ msg: "Todo List already exists, provide a different name" })
      return
    }
    const list = await List.create(req.body)
    res.status(201).json({ list })
  } catch (error) {
    res.status(400).json({ msg: error })
  }
}
