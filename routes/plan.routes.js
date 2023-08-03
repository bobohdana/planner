const { Router } = require('express')

const Plan = require('../models/Plan')
const auth = require('../middleware/auth.middleware')

const router = Router()

router.post('/create', auth, async (req, res) => {
    try {
      const plan = new Plan({
        ...req.body,
        author: req.user.userId
      })
      
      await plan.save()

      res.status(201).json(plan) 
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' })
    }
  }
)

router.get('/', auth, async (req, res) => {
    try {
      const plans = await Plan.find({ author: req.user.userId })

      const { range } = req.query

      const _range = JSON.parse(range)

      const _plans = plans.filter(({ date }) => {
        const time = new Date(date).getTime()
        return time > _range[0] && time < _range[1]
      })

      res.json(_plans)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' })
    }
  }
)

router.get('/:id', auth, async (req, res) => {
    try {
      const plan = await Plan.findById({ _id: req.params.id })
      res.json(plan)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' })
    }
  }
)

router.put('/', auth, async (req, res) => {
    try {
      const plan = req.body
      const updatedPlan = await Plan.findByIdAndUpdate(plan._id, plan, { new: true })

      res.status(200).json(updatedPlan)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' })
    }
  }
)

router.delete(
  '/delete:id',
  async (req, res) => {
    try {
      await Plan.deleteOne({ _id: req.params.id })
      res.status(200).json({ message: 'The plan is deleted' })
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' })
    }
  }
)

module.exports = router