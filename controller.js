import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import Auth from './models/authorization.js'
import generateAccessToken from './accesstoken.js'
import HttpError from './httperror.js'
import RegistrationError from './regerror.js'

export default {
  test(req, res) {
    res.json('test')
  },

  async registration(req,res) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        throw new RegistrationError(400, 'Wrong fields values', errors.errors)
      }

      const {login, password, role} = req.body
      const exists = await Auth.findByPk(login)
      if(exists) {
        throw new RegistrationError(400, 'Such login is already exist')
      }

      const hashedPassword = await bcrypt.hash(password, 7)
      const newUser = {
        login,
        password: hashedPassword,
        role
      }

      await Auth.create(newUser)

      res.json({message: 'Registration completed'})
    } catch(error) {
      if(error instanceof RegistrationError) {
        console.log('Registration Error:', error.message);
        console.log(error.errors);
        res.status(error.code).json({message: error.message, errors: error.errors})
      } else if(error instanceof HttpError) {
        console.log('HTTP Error:', error.message);
        res.status(error.code).json({message: error.message})
      } else {
        throw error
      }
    }
  },

  async login(req, res) {
    try {
      const {login, password} = req.body
      
      const user = await Auth.findByPk(login)
      if(!user) {
        throw new HttpError(400, 'No such user')
      }

      const passwordIsValid = await bcrypt.compare(password, user.password)
      if(!passwordIsValid) {
        throw new HttpError(400, 'Invalid password')
      }

      const token = generateAccessToken({login, role: user.role})
      res.json({token})
    } catch(error) {
      if(error instanceof HttpError) {
        console.log('HTTP Error:', error.message);
        res.status(error.code).json({message: error.message})
      } else {
        throw error
      }
    }
  },
}