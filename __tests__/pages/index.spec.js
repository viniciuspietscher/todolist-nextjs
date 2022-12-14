import Home, { getServerSideProps } from "../../src/pages/index"
import { MongoMemoryServer } from "mongodb-memory-server"

let mongod
const getTestMongo = async () => {
  mongod = await MongoMemoryServer.create()
  const mongoUri = mongod.getUri()
  process.env.MONGODB_URI2 = mongoUri
}
const closeMongoTest = async () => {
  await mongod.stop()
}

describe("test home getServerSideProps", () => {
  it("returns proper props", async () => {
    await getTestMongo()
    const result = await getServerSideProps()
    console.log(result)
    await closeMongoTest()
  })
})
