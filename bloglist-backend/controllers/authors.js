const router = require('express').Router()
const { Op, Sequelize } = require('sequelize')

const { Blog } = require('../models')
const { findAll } = require('../models/blog')

router.get('/', async (req, res, next) => {
    try {
        const authors = await Blog.findAll({
            attributes: [
                'author',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'blogs'],
                [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes']
            ],
            group: ['author'],
            order: [[Sequelize.literal('"likes"'), 'DESC']]
        })
        res.json(authors)
    } catch (error) {
        next(error)
    }
})

module.exports = router