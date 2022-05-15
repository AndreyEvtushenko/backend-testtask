import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import PDFDocument from 'pdfkit'
import Stream from 'stream'
import { writeFile, rm } from 'fs/promises'
import Auth from './models/authorization.js'
import User from './models/user.js'
import generateAccessToken from './accesstoken.js'
import PORT from './index.js'
import HttpError from './httperror.js'
import RegistrationError from './regerror.js'
import ValidationError from './errors/validationerror.js'

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
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        throw new ValidationError(400, 'Wrong fields values', errors.errors)
      }
      
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
    } catch(err) {
      if(err instanceof ValidationError) {
        console.log('Validation Error:', err.message);
        res.status(err.code).json({message: err.message, errors: err.errors})
      } else {
        throw err
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

  async read(req, res) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        throw new ValidationError(400, 'Wrong fields values', errors.errors)
      }

      const user = await User.findByPk(req.query.email, {
        attributes: ['firstName', 'lastName', 'image']
      })
      if(!user) {
        throw new HttpError(400, 'No such user')
      }
      user.image = user.image.replace('/images', 'http://localhost:' + PORT)

      res.json(user)
    } catch(err) {
      if(err instanceof ValidationError) {
        console.log('Validation Error:', err.message);
        res.status(err.code).json({message: err.message, errors: err.errors})
      } else if(err instanceof HttpError) {
        console.log('HTTP Error:', err.message);
        res.status(err.code).json({message: err.message})
      } else {
        throw err
      }
    }
  },

  async downloadPdf(req, res) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        throw new ValidationError(400, 'Wrong fields values', errors.errors)
      }

      const user = await User.findByPk(req.query.email, {
        attributes: ['pdf']
      })
      if(!user) {
        throw new HttpError(400, 'No such user')
      }
      
      await writeFile('output.pdf', user.pdf)
      res.download('./output.pdf', () => rm('./output.pdf'))
    } catch(err) {
      if(err instanceof ValidationError) {
        console.log('Validation Error:', err.message);
        res.status(err.code).json({message: err.message, errors: err.errors})
      } else if(err instanceof HttpError) {
        console.log('HTTP Error:', err.message);
        res.status(err.code).json({message: err.message})
      } else {
        throw err
      }
    }
  },

  async image(req, res) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        throw new ValidationError(400, 'Wrong fields values', errors.errors)
      }

      if(!req.file) {
        throw new HttpError(400, 'No image uploaded')
      }
      
      const user = await User.findByPk(req.body.email)
      user.imagee = '/images/' + req.file.filename
      await user.save()        

      res.json({message: 'Image successfully uploaded'})
    } catch(err) {
      if(err instanceof ValidationError) {
        console.log('Validation Error:', err.message);
        res.status(err.code).json({message: err.message, errors: err.errors})
      } else if(err instanceof HttpError) {
        console.log('HTTP Error:', err.message);
        res.status(err.code).json({message: err.message})
      } else {
        throw err
      }
    }
  },

  async pdf(req, res) {
    try {
      const user = await User.findByPk(req.body.email)
      if(!user) {
        throw new HttpError(400, 'No such email')
      }

      const pdfChunks = []    
      const writableStream = new Stream.Writable()
      writableStream._write = (chunk, encoding, next) => {
        pdfChunks.push(chunk)
        next()
      }

      const doc = new PDFDocument()
      doc.pipe(writableStream)
      doc
        .fontSize(25)
        .text(user.firstName + ' ' + user.lastName, 100, 100)
      doc.image(process.cwd() + user.image)  
      doc.end()

      writableStream.on('close', () => {
        const pdfBuffer = Buffer.concat(pdfChunks)
        user.pdf = pdfBuffer
        user.save()

        res.json({message: true})
      })
    } catch(err) {
      if(err instanceof HttpError) {
        res.status(err.code).json({message: err.message})
      } else {
        res.status(500).json({message: false})
      }
    }  
  }
}