import express from 'express'
import router from './router.js'
import {httpErrorHandler, multerErrorHandler, validationErrorHandler} from './errorhandlers.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.static('images'))
app.use(express.json())
app.use(router)
app.use(validationErrorHandler)
app.use(httpErrorHandler)
app.use(multerErrorHandler)

function start() {
  try {
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}...`)
    })
  } catch(err) {
    console.log(err.message)
  }
}

start()

export default PORT