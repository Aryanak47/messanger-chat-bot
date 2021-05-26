const express = require("express")
const router = express.Router();
const chatbotController = require("../controller/chatbotController")

const initRoute = (app) => {
    router.route('/webhook').post(chatbotController.postWebhook)
    router.route('/webhook').get(chatbotController.getWebhook)
 
    return app.use("/",router)
}





module.exports = initRoute;