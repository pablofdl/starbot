
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
        "text": "This is your first interactive message",
        "attachments": [
            {
                "text": "Building buttons is easy right?",
                "fallback": "Shame... buttons aren't supported in this land",
                "callback_id": "button_tutorial",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "yes",
                        "text": "yes",
                        "type": "button",
                        "value": "yes"
                    },
                    {
                        "name": "no",
                        "text": "no",
                        "type": "button",
                        "value": "no"
                    },
                    {
                        "name": "maybe",
                        "text": "maybe",
                        "type": "button",
                        "value": "maybe",
                        "style": "danger"
                    }
                ]
            }
        ]
    }

    var postOptions = {
        uri: payload.response_url,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: message
    }
    request(postOptions, (error, response, body) => {
        if (error){
            console.log("Error:"+ error)
            // handle errors as you see fit
        }
    })

    res.set("content-type", "application/json")
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /game/ig, handler: handler }
