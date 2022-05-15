import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import key from '../key.js'
import HttpError from '../errors/httperror.js'
import ValidationError from '../errors/validationerror.js'

export default function(req, res, next) {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      throw new ValidationError(400, 'Wrong fields values', errors.errors)
    }

    const token = req.headers.authorization.split(' ')[1]
    if(!token) {
      throw new HttpError(403, 'Access token not found')
    }

    const {email, role} = jwt.verify(token, key)
    if(email != (req.body.email || req.query.email)) {
      if(role != 'admin') {
        throw new HttpError(403, 'You have no rights for this')
      }     
    }
    next()
  } catch(err) {
    if(err instanceof jwt.JsonWebTokenError) {
      console.log('JWT Error:', err.message);
      res.status(403).json({message: err.message})
    } else {
      throw err
    }
  }
}