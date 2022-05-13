import { DataTypes } from 'sequelize'
import sequelize from './orm.js'
import User from './user.js'

const Auth = sequelize.define('Auth', {
  email: {
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

User.hasOne(Auth, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: 'email'
})
Auth.belongsTo(User, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: 'email'
})
await Auth.sync()

export default Auth