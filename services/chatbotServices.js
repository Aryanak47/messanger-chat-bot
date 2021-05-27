


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

exports.setUpUserFacebookProfile = async (req, res) => {
    // Send the HTTP request to the Messenger Platform
    try{
        await setUpMessengerPlatform();
        console.log("---------------")
        console.log("made it !")
        console.log("---------------")
        return res.status(200).json({
            message: "OK"
        });
    }catch (e) {
        return res.status(500).json({
            "message": "Error from the node server"
        })
    }
}

const setUpMessengerPlatform = () => {
    return new Promise((resolve, reject) => {
        try {
            let data = {
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

            request({
                "uri": "https://graph.facebook.com/v6.0/me/messenger_profile",
                "qs": { "access_token":FB_PAGE_TOKEN },
                "method": "POST",
                "json": data
            }, (err, res, body) => {
                if (!err) {
                    console.log("done")
                    resolve("setup done!");
                } else {
                    console.log("error ",err)
                    reject(err);
                }
            });

        } catch (e) {
            reject(e);
        }
    });
}