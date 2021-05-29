
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

exports.setupGetStartedButton = (res) =>{
    var messageData = {
        "get_started": {
            "payload": "GET_STARTED"
        },
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "web_url",
                        "title": "View Facebook Fan Page",
                        "url": "https://www.facebook.com/TECHNEPA",
                        "webview_height_ratio": "full"
                    },
                ]
            }
        ],
    };

    // Start the request
    request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+process.env.FB_PAGE_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log("done------------------------------>")
            res.send(body);
            

        } else { 
            // TODO: Handle errors
            res.send(body);
        }
    });
}        
exports.setupQuickReply = (res,id) =>{
    var messageData = {
        "recipient":{
          "id":id
        },
        "messaging_type": "RESPONSE",
        "message":{
          "text": "Pick a color:",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"Red",
              "payload":"<POSTBACK_PAYLOAD>",
              "image_url":"http://example.com/img/red.png"
            },{
              "content_type":"text",
              "title":"Green",
              "payload":"<POSTBACK_PAYLOAD>",
              "image_url":"http://example.com/img/green.png"
            }
          ]
        }
      }

    // Start the request
    request({
        url: 'https://graph.facebook.com/v10.0/me/messages?access_token='+process.env.FB_PAGE_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log("done------------------------------>")
            res.send(body);
            

        } else { 
            // TODO: Handle errors
            res.send(body);
        }
    });
}        
