const { Schema, Model, model } = require('mongoose')


const PermissionSchema = new Schema({
  _id: Schema.Types.Number,
  code: Schema.Types.String,
})
const Permission = model('permission', PermissionSchema)


const UserSchema = new Schema({
  _id: Schema.Types.Number,
  permissions: [{ type: Schema.Types.Number, ref: Permission }],
})
const User = model('user', UserSchema)

const ConferenceSchema = new Schema({
    _id: Schema.Types.Number,
    users: [{
      type: Schema.Types.Number,
      ref: User,
    }],
  })
  const Conference = model('conference', ConferenceSchema)


module.exports = { Permission, Conference, User }
