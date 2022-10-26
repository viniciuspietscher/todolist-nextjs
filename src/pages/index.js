import Link from "next/link"
import { useState } from "react"
import connectDB from "../lib/mongodb"
import List from "../models/todolist"
import axios from "axios"

export async function getServerSideProps() {
  try {
    await connectDB()
    const result = await List.find({ deleted: false }).sort({ _id: "desc" })
    const lists = result.map((doc) => {
      const list = doc.toObject()
      list._id = list._id.toString()
      return list
    })
    return {
      props: {
        lists: lists,
      },
    }
  } catch (error) {
    console.log(error)
  }
}

export default function Home({ lists }) {
  const [newTodoList, setNewTodoList] = useState("")
  const [todoLists, setTodoLists] = useState(lists)

  const handleAddTodoList = async (e) => {
    e.preventDefault()
    if (!newTodoList || newTodoList.length < 2) {
      return
    }
    await axios
      .post("/api/todoList/addTodoList", {
        name: newTodoList,
      })
      .then((response) => getData())
      .catch((error) => console.log(error))
    setNewTodoList("")
  }

  const getData = async () => {
    await axios
      .get("/api/todoList/getTodoLists")
      .then((response) => setTodoLists(response.data.lists))
      .catch((error) => console.log(error))
  }

  return (
    <div className='container mx-auto'>
      <h1 className='text-3xl text-gray-100 font-bold underline mb-4 mt-4'>
        NextJS Todo List
      </h1>
      <form onSubmit={handleAddTodoList}>
        <div className='mb-4'>
          <label className='text-gray-100 mr-2' htmlFor='name'>
            New List:
          </label>
          <input
            value={newTodoList}
            autoComplete='off'
            type='text'
            id='name'
            name='name'
            onChange={(e) => setNewTodoList(e.target.value)}
          />
        </div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4'
          type='submit'
        >
          Add
        </button>
      </form>
      <ul>
        {todoLists.map((doc) => {
          return (
            <li
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 text-center'
              key={doc._id}
            >
              {doc.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
