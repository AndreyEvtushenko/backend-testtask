import { DataTypes } from 'sequelize'
import sequelize from './orm.js'

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
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