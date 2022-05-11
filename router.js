import { Router } from 'express'
import { check } from 'express-validator'
import controller from './controller.js'
import auth from './middlewares/checkauth.js'
import role from './middlewares/checkrole.js'

const router = Router()

router.get('/checkauth', auth, controller.test)
router.get('/checkrole', role(['admin']), controller.test)
router.post('/registration',
  check('login', 'Name can\'t be empty').notEmpty(),
  check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }),
  controller.registration)
router.post('/login', controller.login)

export default router