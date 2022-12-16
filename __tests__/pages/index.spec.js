import { MongoMemoryServer } from "mongodb-memory-server"
import List from "../../src/models/todolist"
import { MongoClient } from "mongodb"
import mongoose from "mongoose"
import connectDB from "../../src/lib/mongodb"
import Home, { getServerSideProps } from "../../src/pages/index"

jest.mock("../../src/lib/mongodb", () => {
  const original = jest.requireActual("../../src/lib/mongodb")
  return {
    __esModule: true,
    default: jest.fn(original.default),
  }
})

let mongod, conn

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const mongoUri = mongod.getUri()
  process.env.MONGODB_URI2 = mongoUri
  conn = await MongoClient.connect(mongoUri, {})
})

afterAll(async () => {
  if (conn) {
    await conn.close()
  }

  mongoose.disconnect()
  if (mongod) {
    await mongod.stop()
  }
})

describe("test home getServerSideProps", () => {
  it("throws an error", async () => {
    connectDB.mockImplementationOnce(async () => {
      throw new Error("error thrown")
    })
    const result = await getServerSideProps()
    // console.log(result)
    expect(result.props).toBeUndefined()
    expect(result.notFound).toBeDefined()
    expect(result.notFound).toBeTruthy()
  })

  it("returns two empty lists if no data in DB", async () => {
    const expectedData = { props: { lists: [], items: [] } }
    const result = await getServerSideProps()
    expect(expectedData).toEqual(result)
  })

  // it("returns proper props", async () => {
  //   const data = [{ name: "List 1" }, { name: "List 2" }, { name: "List 3" }]
  //   const db = conn.db(mongod.instanceInfo.dbName)
  //   const res = await db.collection("lists").insertMany(data)
  //   console.log(res)
  //   const result2 = await getServerSideProps()
  //   console.log(result2)
  // })
})
