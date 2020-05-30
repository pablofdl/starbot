
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
                "title": "The Further Adventures of Slackbot",
                "fields": [
                    {
                        "title": "Volume",
                        "value": "1",
                        "short": true
                    },
                    {
                        "title": "Issue",
                        "value": "3",
                "short": true
                    }
                ],
                "author_name": "Stanford S. Strickland",
                "author_icon": "http://a.slack-edge.com/7f18https://a.slack-edge.com/80588/img/api/homepage_custom_integrations-2x.png",
                "image_url": "http://i.imgur.com/OJkaVOI.jpg?1"
            },
              {
                title: "Random Fact",
                color: "#2FA44G",
                text: "https://www.youtube.com/watch?v=Bb4ackoZfdA",
                mrkdwn_in: ["text"]
              },
              {
              "type": "file",
              "external_id": "audio1",
              "source": "remote",
            },
              {
              "type": "file",
              "external_id": "video1",
              "source": "remote",
            },
            {
                "text": "Building buttons is easy right?",
                "fallback": "Shame... buttons aren't supported in this land",
                "callback_id": "button_tutorial",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "image_url": "http://i.imgur.com/OJkaVOI.jpg?1",
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
    res.status(200)
    return
}

module.exports = { pattern: /game/ig, handler: handler }
