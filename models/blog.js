const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    validate: {
      isString(value) {
        if (typeof value !== 'string') {
          throw new Error('author must be a string')
        }
      }
    },
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [1991],
        msg: 'year must be at least 1991'
      },
      max(value) {
        if (value > new Date().getFullYear()) {
          throw new Error('year cannot be in the future')
        }
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

module.exports = Blog