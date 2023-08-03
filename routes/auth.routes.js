const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../models/User')

const router = Router()

router.post(
  '/register',
  [
    check('name', 'The name is extremely short').isLength({ min: 2 }),
    check('email', 'The email is not correct').isEmail(),
    check('password', 'The password length is more than 6 symbols')
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(),
          message: 'Incorrect data while registration'
        })
      }

      const { name, email, password } = req.body

      const candidate = await User.findOne({ email })

      if (candidate) {
        return res.status(400).json({ message: 'The user already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ name, email, password: hashedPassword })

      await user.save()
      res.status(201).json({ message: 'The user is created' })
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' })
    }
  }
)

router.post(
  '/login',
  [
    check('email', 'The email is not correct').normalizeEmail().isEmail(),
    check('password', 'The password length is more than 6 symbols').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(),
          message: 'Incorrect data while signing in' 
        })
      }
  
      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'The user is not found' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'The password is wrong, try again' })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '24h' },
      )

      res.json({ token, userId: user.id })
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' })
    }
  }
)

module.exports = router