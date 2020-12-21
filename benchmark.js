const { Conference, User, Permission } = require('./schema')
const mongoose = require('mongoose')
const fs = require('fs/promises')

const n = process.env.MAX_N || 50

async function lookup() {
  const times = []

  for (let i = 1; i < n; ++i) {
    let startTime = Date.now()
    const conferences = await Conference.aggregate([
      
      { $limit: i }  ,{
        $lookup: {
          from: 'users',
          let: { userIds: '$users'},
          as: 'users',
          pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$userIds' ] }} },
              {
                  $lookup: {
                      from: 'permissions',
                      let : { permissionIds: '$permissions'  },
                        pipeline: [
                          {  $match: { $expr: {  $in: ['$_id', '$$permissionIds' ] }}}
                        ],
                      as: 'permissions'
                  }
              }
          ]
        },
      },
      
    ])
    times.push(Date.now() - startTime)
  }
  return times
}

async function populate() {
  const times = []
  for (let i = 1; i < n; ++i) {
    let startTime = Date.now()
    const conferences = await Conference.find()
      .limit(i)
      .populate({ path: 'users', populate: 'permissions' })
    times.push(Date.now() - startTime)
  }
  return times
}
async function main() {
  await mongoose.connect('mongodb://localhost:27017/benchmark_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 1,
  })
  const populate_takens = await populate()
  const lookup_takens = await lookup()

  console.log('Populate takens', populate_takens)
  console.log('Lookup takens', lookup_takens)
  fs.writeFile('populate_data.json', JSON.stringify({ data: populate_takens }))
  fs.writeFile('lookup_data.json', JSON.stringify({ data: lookup_takens}))
  mongoose.connection.close(true)
}

main()
