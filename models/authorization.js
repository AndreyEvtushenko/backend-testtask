import { DataTypes } from 'sequelize'
import sequelize from './orm.js'

const Auth = sequelize.define('Auth', {
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true
})

await Auth.sync()

export default Auth