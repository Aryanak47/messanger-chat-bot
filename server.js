require('dotenv').config()
const express = require("express")
const router = require("./route/web.js")
const bodyParser = require("body-parser")
var cors = require('cors')
const app = express();

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(cors())

router(app)


let port = process.env.PORT || 3000

app.listen(port,() => {
    console.log(`listening to port ${port}`)
})
