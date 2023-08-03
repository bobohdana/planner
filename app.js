const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', require('./routes/auth.routes.js'))
app.use('/api/plan', require('./routes/plan.routes.js'))
app.use('/api/user', require('./routes/user.routes.js'))

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'))
    app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`))
  } catch (e) {
    console.log('Server error', e.message)
    process.exit(1)
  }
}

start()
