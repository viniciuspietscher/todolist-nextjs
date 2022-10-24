import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import connectDB from "../lib/mongodb"
import List from "../models/todolist"

export async function getServerSideProps() {
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
}

export default function Home({ lists }) {
  return (
    <div className={styles.container}>
      <h2>hello world</h2>
      <ul>
        {lists.map((doc) => {
          return <li key={doc._id}>{doc.name}</li>
        })}
      </ul>
    </div>
  )
}
