import { Router } from 'express'
import { check } from 'express-validator'
import controller from './controller.js'
import checkauth from './middlewares/checkauth.js'
import auth from './middlewares/checkauth.js'
import role from './middlewares/checkrole.js'
import uploadImage from './middlewares/image.js'

const router = Router()

router.get('/checkauth', auth, controller.test)
router.get('/checkrole', role(['admin']), controller.test)
router.post('/registration',
  uploadImage.single('image'),
  check('email', 'Wrong email').isEmail(),
  check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }),
  check('firstName', 'First name can\'t be empty').notEmpty(),
  check('lastName', 'Last name can\'t be empty').notEmpty(),
  check('role', 'Role can be "user" or "admin"').isIn(['user', 'admin']),
  controller.registration)
router.post('/login', 
  check('email', 'Wrong email').exists().isEmail(),
  check('password', 'Password must be at least 4 characters long').exists().isLength({ min: 4 }),
  controller.login)
/* router.post('/create', 
  uploadImage.single('image'),
  check('email', 'Wrong email').isEmail(),
  check('firstName', 'First name can\'t be empty').notEmpty(),
  check('lastName', 'Last name can\'t be empty').notEmpty(),
  controller.create) */
router.post('/image',
  check('Authorization', 'There are no authorization header').exists(),
  uploadImage.single('image'),
  check('email', 'Wrong email').isEmail(),
  checkauth,
  controller.image)
router.post('/pdf', 
  check('Authorization', 'There are no authorization header').exists(),
  check('email', 'Email is not provided').exists(),
  checkauth,
  controller.pdf)

export default router