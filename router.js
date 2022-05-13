import { Router } from 'express'
import { check } from 'express-validator'
import controller from './controller.js'
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
  controller.registration)
router.post('/login', controller.login)
router.post('/create', 
  uploadImage.single('image'),
  check('email', 'Wrong email').isEmail(),
  check('firstName', 'First name can\'t be empty').notEmpty(),
  check('lastName', 'Last name can\'t be empty').notEmpty(),
  controller.create)
router.post('/image', uploadImage.single('image'), controller.image)

export default router