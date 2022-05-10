import express from 'express'
import router from './router.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(router)

function start() {
  try {
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}...`);
    })
  } catch(error) {
    console.log(error.message)
  }
}

start()