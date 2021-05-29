
const request = require('request')

exports.getUserName = (id) =>{
    return new Promise((resolve,reject) => {
        request({
            "uri": `https://graph.facebook.com/${id}?access_token=${process.env.FB_PAGE_TOKEN}`,
            "method": "GET",
          }, (err, res, body) => {
            if (!err) {
                 //convert string to json object
                 body = JSON.parse(body);
                const name = `${body.first_name} ${body.last_name}`
                resolve(name)
            } else {
              reject("Unable to send message:" + err);
            }
          }); 
    })
}

       
exports.setupQuickReply = (id) =>{
    try {
        var messageData = {
            "recipient":{
            "id":id
            },
            "messaging_type": "RESPONSE",
            "message":{
            "text": "Select:",
            "quick_replies":[
                {
                "content_type":"text",
                "title":"Show Books",
                "payload":"BOOKS",
                "image_url":"https://miro.medium.com/max/11520/1*O2asIK6qznxs-O0dVnMKHA.jpeg"
                },{
                "content_type":"text",
                "title":"Developer info",
                "payload":"PROFILE"
                },{
                "content_type":"text",
                "title":"Visit Website",
                "payload":"WEBSITE",
                
                }
                ,{
                "content_type":"text",
                "title":"Talk to agent",
                "payload":"AGENT",
                
                }
            ]
            }
        }

        // Start the request
        request({
            url: 'https://graph.facebook.com/v6.0/me/messages?access_token='+process.env.FB_PAGE_TOKEN,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            form: messageData
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                return;
                

            } else { 
                // TODO: Handle errors
                return ;
            
            }
        });
    } catch (error) {
        console.log(error)
        return ;
        
    }
} 

const sendMessage = (response,id) => {
    return new Promise((resolve,reject) => {
        // Send the HTTP request to the Messenger Platform
        let request_body = {
            "recipient": {
                "id": id
            },
            "message": response,
        };
        request({
            "uri": "https://graph.facebook.com/v6.0/me/messages",
            "qs": { "access_token": process.env.FB_PAGE_TOKEN },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                resolve('message sent!')
            } else {
                reject("Unable to send message:" + err);
            }
        }); 

    })

}
exports.talkToAgent = (id) => {
    return new Promise((resolve,reject) => {
        // Send the HTTP request to the Messenger Platform
         // Send the HTTP request to the Messenger Platform
        try {
            let messageData = {
                "recipient":{"id":id},
                "target_app_id":process.env.PAGE_INBOX_ID
            };
            // Start the request
            request({
            url: 'https://graph.facebook.com/v2.6/me/pass_thread_control?access_token='+process.env.FB_PAGE_TOKEN,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            form: messageData
            },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let r = { "text": "Bot is off!" }
                    await sendMessage(r,id)
                    resolve("done")
                } else { 
                    reject(error)
                
                }
            });
        } catch (error) {
            reject(error)
             
        }

    })

}
exports.talkToBot = (id) => {
    return new Promise((resolve,reject) => {
        // Send the HTTP request to the Messenger Platform
         // Send the HTTP request to the Messenger Platform
        try {
            let messageData = {
                "recipient":{"id":id}
            };
            // Start the request
            request({
            url: 'https://graph.facebook.com/v2.6/me/take_thread_control?access_token='+process.env.FB_PAGE_TOKEN,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            form: messageData
            },async(error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let  response = {"text": `Bot is on !`}
                    await sendMessage(response,id)
                    resolve("done")
                } else { 
                    reject(error)
                
                }
            });
        } catch (error) {
            reject(error)
             
        }

    })

}
        

exports.showBooks =(id)=>{
    return new Promise( async (resolve,reject) => {
        try {
            response = {
                "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                            {
                                "title": "Sport",
                                "subtitle": "Tap a button to answer.",
                                "image_url": "https://github.com/Aryanak47/Libary-Management-System/blob/main/public/img/book/book1.jpg?raw=true",
                                "buttons": [
                                    {
                                    "type": "postback",
                                    "title": "Show Sport Books",
                                    "payload": "SPORT",
                                    }
                                ],
                            },
                            {
                                "title": "Programming",
                                "subtitle": "Tap a button to answer.",
                                "image_url": "https://tutorialzine.com/media/2018/01/NodeJs_Succinctly2.jpg",
                                "buttons": [
                                    {
                                    "type": "postback",
                                    "title": "Show Programming Books",
                                    "payload": "CODE",
                                    }
                                ],
                            },
                            {
                                "title": "Self-help",
                                "subtitle": "Tap a button to answer.",
                                "image_url": "https://inteng-storage.s3.amazonaws.com/img/iea/Xm6lqRdEwD/life-lessons-rules-for-success-elon-musk.jpg",
                                "buttons": [
                                    {
                                    "type": "postback",
                                    "title": "Show Self-help Books",
                                    "payload": "SELF",
                                    }
                                ],
                            },
                            {
                                "title": "Science",
                                "subtitle": "Tap a button to answer.",
                                "image_url": "https://media.wired.com/photos/5dfc0b15a03b9b0008afa1a0/master/w_1600%2Cc_limit/Science_books_9781328879981_hres.jpg",
                                "buttons": [
                                    {
                                    "type": "postback",
                                    "title": "Show Science Books",
                                    "payload": "SCIENCE",
                                    }
                                ],
                            }
                        ]
                    }
                }
            }
            await sendMessage(response,id)
            resolve('done !')
        } catch (error) {
            reject(error)
            
        }
        
    })
}


