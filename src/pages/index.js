import Link from "next/link"
import { useState } from "react"
import connectDB from "../lib/mongodb"
import List from "../models/todolist"
import Item from "../models/todoitem"
import axios from "axios"

export async function getServerSideProps() {
  try {
    await connectDB()
    const result = await List.find({ deleted: false }).sort({ _id: "desc" })
    if (result.length == 0) {
      return {
        props: {
          lists: [],
          items: [],
        },
      }
    }
    const itemsRes = await Item.find({
      deleted: false,
      listId: result[0]._id,
    }).sort({ _id: "desc" })
    const lists = result.map((doc) => {
      const list = doc.toObject()
      list._id = list._id.toString()
      return list
    })
    const items = itemsRes.map((doc) => {
      const item = doc.toObject()
      item._id = doc._id.toString()
      item.listId = doc.listId.toString()
      return item
    })
    return {
      props: {
        lists: lists,
        items: items,
      },
    }
  } catch (error) {
    console.log(error)
  }
}

export default function Home({ lists, items }) {
  const [newTodoList, setNewTodoList] = useState("")
  const [newTodoItem, setNewTodoItem] = useState("")
  const [todoLists, setTodoLists] = useState(lists)
  const [todoItems, setTodoItems] = useState(items)
  const [selectedList, setSelectedList] = useState(lists[0])

  const handleAddTodoItem = async (e) => {
    e.preventDefault()
    if (!newTodoItem || newTodoItem.length < 2) {
      return
    }
    await axios
      .post("api/todoItem/addTodoItem", {
        item: newTodoItem,
        listId: selectedList._id,
      })
      .then((response) => getItems(response.data.item.listId))
      .catch((error) => console.log(error))
    setNewTodoItem("")
  }

  const handleAddTodoList = async (e) => {
    e.preventDefault()
    if (!newTodoList || newTodoList.length < 2) {
      return
    }
    await axios
      .post("/api/todoList/addTodoList", {
        name: newTodoList,
      })
      .then((response) => setSelectedList(response.data.list))
      .then(() => getData())
      .then(() => setTodoItems([]))
      .catch((error) => console.log(error))
    setNewTodoList("")
  }

  const getData = async () => {
    await axios
      .get("/api/todoList/getTodoLists")
      .then((response) => setTodoLists(response.data.lists))
      .catch((error) => console.log(error))
  }

  const getItems = async (listId) => {
    await axios
      .get(`/api/todoItem/getItems/${listId}`)
      .then((response) => setTodoItems(response.data.items))
      .catch((error) => console.log(error))
  }

  return (
    <div className='container mx-auto border-2 border-indigo-500/100'>
      <div className='flex flex-row'>
        <div className='basis-1/3 border-2 border-red-500/100'>
          <h1 className='text-center text-3xl text-gray-100 font-bold underline mb-4 mt-4'>
            NextJS Todo List
          </h1>
        </div>
        <div className='basis-2/3 border-2 border-red-500/100'>02</div>
      </div>
      <div className='flex flex-row'>
        <div className='basis-1/3 border-2 border-green-500/100'>
          <form
            className='flex flex-row items-center'
            onSubmit={handleAddTodoList}
          >
            <div className='mx-auto'>
              <label className='text-gray-100' htmlFor='name'>
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
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              type='submit'
            >
              Add
            </button>
          </form>
        </div>
        <div className='flex items-center justify-center basis-2/3 border-2 border-green-500/100'>
          <h2 className='text-gray-100'>
            {selectedList ? selectedList.name : ""}
          </h2>
        </div>
      </div>
      <div className='flex flex-row'>
        <div className='basis-1/3 border-2 border-white-500/100'>
          <ul>
            {todoLists.map((doc) => {
              return (
                <li
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 text-center'
                  key={doc._id}
                >
                  {doc.name}
                </li>
              )
            })}
          </ul>
        </div>
        <div className='flex justify-center basis-2/3 border-2 border-white-500/100'>
          <div className='basis-1/3 border-2 border-green-500/100'>
            <form
              className='flex flex-row items-center'
              onSubmit={handleAddTodoItem}
            >
              <div className='mx-auto'>
                <label className='text-gray-100' htmlFor='name'>
                  New Item:
                </label>
                <input
                  value={newTodoItem}
                  autoComplete='off'
                  type='text'
                  id='name'
                  name='name'
                  onChange={(e) => setNewTodoItem(e.target.value)}
                />
              </div>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                type='submit'
              >
                Add
              </button>
            </form>
            <ul>
              {todoItems.map((doc) => {
                return (
                  <li className='text-gray-100' key={doc._id}>
                    {doc.item}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
