import jwt from 'jsonwebtoken'
import key from './key.js'

function getAccessToken(payload) {
  return jwt.sign(payload, key, {expiresIn: '24h'})
}

export default getAccessToken