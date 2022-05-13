import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import Auth from './models/authorization.js'
import User from './models/user.js'
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

      const exists = await Auth.findByPk(req.body.email)
      if(exists) {
        throw new RegistrationError(400, 'Email is already in use')
      }

      const newUser = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }
      if(req.file) {
        newUser.image = '/images/' + req.file.filename
      }
      await User.create(newUser)

      const hashedPassword = await bcrypt.hash(req.body.password, 7)
      const newAuth = {
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
      }
      await Auth.create(newAuth)

      res.json({message: 'Registration completed'})
    } catch(error) {
      if(error instanceof RegistrationError) {
        console.log('Registration Error:', error.message);
        console.log(error.errors);
        res.status(error.code).json({message: error.message, errors: error.errors})
      } else {
        throw error
      }
    }
  },

  async login(req, res) {
    try {
      const {email, password} = req.body
      
      const user = await Auth.findByPk(email)
      if(!user) {
        throw new HttpError(400, 'No such user')
      }

      const passwordIsValid = await bcrypt.compare(password, user.password)
      if(!passwordIsValid) {
        throw new HttpError(400, 'Invalid password')
      }

      const token = generateAccessToken({email, role: user.role})
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

  async create(req, res) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        throw new RegistrationError(400, 'Wrong fields values', errors.errors)
      }

      const exists = await User.findByPk(req.body.email)
      if(exists) {
        throw new RegistrationError(400, 'Email is already in use')
      }

      const newUser = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }
      if(req.file) {
        newUser.image = '/images/' + req.file.filename
      }
      await User.create(newUser)

      res.json({message: 'User created'})
    } catch(error) {
      if(error instanceof RegistrationError) {
        console.log('Registration Error:', error.message);
        res.status(error.code).json({message: error.message, errors: error.errors})
      } else {
        throw error
      }
    }
  },

  async image(req, res) {
    await User.create({
      image: '/images/' + req.file.filename
    })

    res.json({message: 'Image successfully uploaded'})
  }
}