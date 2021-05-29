const request = require('request');
const chatServices = require("../services/chatbotServices")
let firstMessage = true
// Creates the endpoint for our webhook 
exports.postWebhook=   (req, res) => { 
   
    // Parse the request body from the POST
    let body = req.body;
  
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
  
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        if (entry.standby) {
          let webhook_standby = entry.standby[0];
          if(webhook_standby && webhook_standby.message){
              if (webhook_standby.message.text === "back" || webhook_standby.message.text === "exit") {
                  //if user's message is "back" or "exit", return the conversation to the bot
                  chatServices.talkToBot(webhook_standby.sender.id);
              }
          }

          return;
        }
          // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);


        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
      
        console.log('Sender PSID: ' + sender_psid);
        if(firstMessage){
          chatServices.setupQuickReply(sender_psid)
          firstMessage=false

        }
       
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        }
      });
  
      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
  
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  };

  exports.getWebhook= (req, res) => {  
      // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }

  }
}

// Handles messages events
const  handleMessage = async (sender_psid, received_message) => {
    let response;

    if (received_message && received_message.quick_reply && received_message.quick_reply.payload) {
      //asking about phone number
      if (received_message.quick_reply.payload === "BOOKS"){
        return await chatServices.showBooks(sender_psid)
        
      }
      else if (received_message.quick_reply.payload === "PROFILE") {
        response = {"text": `https://github.com/Aryanak47`}
        return  callSendAPI(sender_psid, response);
      }
      else if (received_message.quick_reply.payload === "WEBSITE"){
        response = {"text": `https://github.com/Aryanak47`}
        return  callSendAPI(sender_psid, response);

      }
      else if (received_message.quick_reply.payload === "AGENT"){
        response = { "text": "Bot is off!" }
        await chatServices.talkToAgent(sender_psid)
        return   callSendAPI(sender_psid, response);
      }
    }
  // Check if the received_message contains text
    else if(received_message.text) {    

    // Create the payload for a basic text message
    return chatServices.setupQuickReply(sender_psid)
   
  }else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  
  // Sends the response message
  callSendAPI(sender_psid, response);

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case "SPORT":
      response = { "text": "Oops, not available!" }
      break;
    case "CODE":
      response = { "text": "Oops, not available!" }
      break;
    case "SELF":
      response = { "text": "Oops, not available!" }
      break;
    case "SCIENCE":
      response = { "text": "Oops, not available!" }
      break;
    default:
      return chatServices.setupQuickReply(sender_psid)
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
     // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v6.0/me/messages",
    "qs": { "access_token": process.env.FB_PAGE_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
      console.log(`my message ${response}`)
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}
