
'use strict'

const _ = require('lodash')
const request = require('request')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {
    const message = {
        "text": "Welcome to the Grip game",
        "attachments": [
            {
              "type": "input",
              "block_id": "input123",
              "label": {
                "type": "plain_text",
                "text": "Label of input"
              },
              "element": {
                "type": "plain_text_input",
                "action_id": "plain_input",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Enter some plain text"
                }
              }
            },
            {
                "text": "The ducks have been kidnapped.\n blablabla\n You will have to travel around the world to recover ducks from grippers \n Are you ready for the challenge?",
                "fallback": "Shame... buttons aren't supported in this land",
                "callback_id": "button_tutorial",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "image_url": "http://i.imgur.com/OJkaVOI.jpg?1",
                "element": {
                  "type": "plain_text_input",
                  "action_id": "plain_input2",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Enter some plain text"
                  }
                },
                "actions": [
                    {
                        "name": "yes",
                        "text": "yes",
                        "type": "button",
                        "value": "yes"
                    },
                    {
                        "name": "yes",
                        "text": "yes",
                        "type": "button",
                        "value": "yes"
                    }
                ]
            }
        ]
    }
    //
    // const postOptions = {
    //     uri: payload.response_url,
    //     method: 'POST',
    //     headers: {
    //         'Content-type': 'application/json'
    //     },
    //     json: message
    // }
    // request(postOptions, (error, response, body) => {
    //     if (error){
    //         console.log("Error:"+ error)
    //         // handle errors as you see fit
    //     }
    // })
    //
    // const options = {
    //     'method': 'POST',
    //     'url': 'https://slack.com/api/files.remote.share',
    //     'headers': {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     form: {
    //         'token': 'xoxb-1178613160256-1140227414279-HiNX0tSNJ61jlcXmHTTt127B',
    //         'channels': 'C0144105ZU7',
    //         'external_id': 'video1'
    //     }
    // };
    // request(options, function (error, response) {
    //     console.log(response)
    //     if (error){
    //         console.log("Error:"+ error)
    //         // handle errors as you see fit
    //     }
    // });

    res.set("content-type", "application/json")
    res.status(200).json(message)
    return
}

module.exports = { pattern: /game/ig, handler: handler }
