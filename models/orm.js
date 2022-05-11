import { Sequelize } from 'sequelize'

const options = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'ivashintesttask',
  username: 'app_user',
  password: 'I-need-2-connect',
  logging: console.log
}

export default new Sequelize(options)