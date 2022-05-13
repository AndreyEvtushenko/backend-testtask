import { DataTypes } from 'sequelize'
import sequelize from './orm.js'
import Auth from './authorization.js'

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING
  },
  pdf: {
    type: DataTypes.BLOB
  }
}, {
  freezeTableName: true,
})


await User.sync()

export default User