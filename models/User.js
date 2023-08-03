const { Schema, model, Types } = require('mongoose')

const schema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plans: [{ type: Types.ObjectId, ref: 'Plan' }],
  picture: { type: String, default: '' },
})

module.exports = model('User', schema)