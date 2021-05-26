const express = require("express")
const router = express.Router();

const initRoute = (app) => {
    router.route('/').get((req,res) => {
        res.send("Hello world !")
    })
    return app.use("/",router)
}





module.exports = initRoute;