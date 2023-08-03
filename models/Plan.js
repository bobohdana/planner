const { Schema, model, Types } = require('mongoose')

const schema = Schema({
  text: { type: String },
  isCompleted: { type: Boolean, default: false },
  author: { type: Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  time: { type: Date },
  subscribers: [{ type: Types.ObjectId, ref: 'User' } ]
})

module.exports = model('Plan', schema)