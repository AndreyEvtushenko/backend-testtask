import jwt from 'jsonwebtoken'
import key from '../key.js'
import HttpError from '../httperror.js'

export default function(allowedRoles) {
  return function(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      if(!token) {
        throw new HttpError(403, 'Access token not found')
      }
  
      const {role} = jwt.verify(token, key)
      let allowed = allowedRoles.includes(role)
      if(!allowed) {
        throw new HttpError(403, 'User has not rights for this')
      }
      next()
    } catch(error) {
      if(error instanceof HttpError) {
        console.log('HTTP Error:', error.message);
        res.status(error.code).json({message: error.message})
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.log('JWT Error:', error.message);
        res.status(403).json({message: error.message})
      } else {
        throw error
      }
    }
  }
  
}