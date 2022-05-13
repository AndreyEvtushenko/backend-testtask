import { DataTypes } from 'sequelize'
import sequelize from './orm.js'

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pdf: {
    type: DataTypes.BLOB,
    allowNull: true,
  }
}, {
  freezeTableName: true,
})

await User.sync()

export default User