// import mongoose from "mongoose"

export interface ITodoItem<T> {
  _id: T
  listId: T
  item: string
  completed: boolean
  deleted: boolean
}

export interface ITodoList<T> {
  _id: T
  name: string
  deleted: boolean
}
