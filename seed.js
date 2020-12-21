const mongoose = require('mongoose')
const { Conference, User, Permission } = require('./schema')

async function main() {
  await mongoose.connect('mongodb://localhost:27017/benchmark_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 1,
  })
  let db = mongoose.connection

  await db.dropDatabase()
  console.log('========= DROP DB')

  const n_conference = 3000
  const n_user = 1000
  const n_permission = 100

  const randomIDs = (expectedN, maxN) =>
    Array.from(
      new Set(
        Array.from({ length: expectedN }, () =>
          Math.floor(Math.random() * maxN)
        )
      )
    )
  const randomCode = () => Math.random().toString(36).substring(7)

  for (let i = 0; i < n_user; i++) {
    const randomPermissionIDs = randomIDs(40, n_permission)
    await new User({ _id: i, permissions: randomPermissionIDs }).save()
  }

  console.log('========= ' + n_permission + ' users inserted')

  for (let i = 0; i < n_conference; i++) {
    const userIDs = randomIDs(20, n_user)
    // await db.collection().insertOne({ _id: i, users: userIDs })
    await new Conference({ _id: i, users: userIDs }).save()
  }
  console.log(
    '========= ' +
      n_conference +
      ' conferences which associated with users inserted'
  )

  for (let i = 0; i < n_permission; i++) {
    const code = randomCode().toUpperCase()
    // await db.collection('permissions').insertOne({ _id: i, code })
    await new Permission({ _id: i, code }).save()
  }
  console.log('========= ' + n_permission + ' permissions inserted')

  mongoose.connection.close(true)
}

main()
