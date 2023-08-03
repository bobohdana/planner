const { Router } = require('express')

const User = require('../models/User')
const auth = require('../middleware/auth.middleware')

const router = Router()

const multer = require('multer')
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
})

const upload = multer({ storage })

router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById({ _id: req.user.userId })

      res.json(user)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' })
    }
  }
)

router.put('/', auth, upload.single('picture'), async (req, res) => {
    try {
      const data = req.body

      if (req.file) {
        const user = await User.findById({ _id: req.user.userId })
        fs.unlink(user.picture, (err) => {
          if (err) {
            console.error(err)
            return
          }
          console.log('File deleted successfully')
        })
      }

      const user = await User.findByIdAndUpdate(
        req.user.userId, { ...data,
          picture: req.file ? req.file.path : ''
        }, { new: true }
      )

      res.json(user)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' })
    }
  }
)

module.exports = router