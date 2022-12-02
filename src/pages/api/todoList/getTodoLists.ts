import connectDB from "../../../lib/mongodb"
import List from "../../../models/todolist"
import { NextApiRequest, NextApiResponse } from "next"

export default async function getTodoLists(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB()
    const lists = await List.find({ deleted: false }).sort({ _id: "desc" }) //get not deleted lists and sort by newest first
    res.status(200).json({ lists })
  } catch (error) {
    res.status(400).json({ error })
  }
}
