const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog } = require('../models')

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll({
            include: {
                model: Blog,
                attributes: {
                    exclude: ['userId']
                }
            },
            attributes: {
                exclude: ['passwordHash']
            }
        })
        res.json(users)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { name, username, password } = req.body

        if (!password) {
            return res.status(400).json({
                error: 'password is required'
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            username,
            passwordHash
        })

        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: {
                exclude: ['passwordHash']
            },
            include: {
                model: Blog,
                attributes: {
                    exclude: ['userId']
                }
            }
        })

        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            })
        }

        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.put('/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.params.username
            },
        })

        if (!user) {
        return res.status(404).json({ error: 'user not found' })
        }

        user.name = req.body.name

        await user.save()

        res.json({
            id: user.id,
            name: user.name,
            username: user.username
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router