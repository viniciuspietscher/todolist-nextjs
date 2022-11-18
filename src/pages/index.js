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

  const handleSelectedList = async (listId) => {
    await axios
      .get(`/api/todoItem/getItems/${listId}`)
      .then((response) => {
        setTodoItems(response.data.items)
        setSelectedList(todoLists.find((elem) => elem._id === listId))
      })
      .catch((error) => console.log(error))
  }

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

  const handleComplete = async (itemId, listId) => {
    await axios
      .put(`/api/todoItem/updateItem/${itemId}`)
      .then((response) => getItems(listId))
      .catch((error) => console.log(error))
  }

  const handleDelete = async (itemId, listId) => {
    await axios
      .put(`/api/todoItem/deleteItem/${itemId}`)
      .then((response) => getItems(listId))
      .catch((error) => console.log(error))
  }

  return (
    <div className='container mx-auto'>
      <div className='flex flex-row'>
        <div className='basis-1/3 h-80'>
          <h1 className='text-center text-3xl text-gray-100 font-bold underline mb-4 mt-10'>
            NextJS Todo List
          </h1>
        </div>
        <div className='flex justify-center items-end mb-10 basis-2/3'>
          <h2 className='text-center text-gray-100 text-3xl text-gray-100 font-bold underline'>
            {selectedList ? selectedList.name : ""}
          </h2>
        </div>
      </div>
      <div className='flex flex-row'>
        <div className='basis-1/3'>
          <form
            className='flex flex-row items-center'
            onSubmit={handleAddTodoList}
          >
            <div className='mx-auto'>
              <label className='text-gray-100' htmlFor='name'>
                New List:
              </label>
              <input
                className='ml-2'
                value={newTodoList}
                autoComplete='off'
                type='text'
                id='name'
                name='name'
                onChange={(e) => setNewTodoList(e.target.value)}
              />
            </div>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-1'
              type='submit'
            >
              Add
            </button>
          </form>
        </div>
      </div>
      <div className='flex flex-row'>
        <div className='basis-1/3'>
          <ul>
            {todoLists.map((doc) => {
              return (
                <li
                  className={`${
                    doc._id === selectedList._id
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-blue-500"
                  } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 text-center cursor-pointer`}
                  onClick={() => handleSelectedList(doc._id)}
                  key={doc._id}
                >
                  {doc.name}
                </li>
              )
            })}
          </ul>
        </div>
        <div className='flex justify-center basis-2/3'>
          <div className='min-w-96'>
            {selectedList ? (
              <form
                className='flex items-center justify-between mb-4'
                onSubmit={handleAddTodoItem}
              >
                <div>
                  <label className='text-gray-100' htmlFor='name'>
                    New Item:
                  </label>
                  <input
                    className='ml-2'
                    value={newTodoItem}
                    autoComplete='off'
                    type='text'
                    id='name'
                    name='name'
                    onChange={(e) => setNewTodoItem(e.target.value)}
                  />
                </div>
                <button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2'
                  type='submit'
                >
                  Add
                </button>
              </form>
            ) : (
              ""
            )}
            <ul>
              {todoItems.map((doc) => {
                return (
                  <li
                    className={`${
                      doc.completed
                        ? "line-through text-gray-400 decoration-wavy decoration-indigo-500"
                        : "text-gray-100"
                    } flex justify-between items-center`}
                    key={doc._id}
                  >
                    {doc.item}
                    <div>
                      <button
                        className='bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ml-2'
                        onClick={() => handleComplete(doc._id, doc.listId)}
                      >
                        {doc.completed ? "Not done" : "Done"}
                      </button>
                      <button
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 mb-2'
                        onClick={() => handleDelete(doc._id, doc.listId)}
                      >
                        Delete
                      </button>
                    </div>
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
