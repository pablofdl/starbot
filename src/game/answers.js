
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  icon_emoji: config('ICON_EMOJI')
}

const send_next = function(payload) {
    const postOptions = {
        uri: payload.response_url,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: req.app.locals.phase[req.app.locals.current_phase[payload.channel.name]].message
    }
    request(postOptions, (error, response, body) => {
        if (error){
            console.log("Error:"+ error)
            // handle errors as you see fit
        }
    })

}

const handler = (req, payload, res) => {
    if (req.app.locals.current_phase[payload.channel.name]) {
        if (req.app.locals.scores[payload.channel.name]) {
            req.app.locals.scores[payload.channel.name].ducks += req.app.locals.phase[req.app.locals.current_phase[payload.channel.name]].ducks;
        } else {
            req.app.locals.scores[payload.channel.name] = {
                "ducks": req.app.locals.phase[req.app.locals.current_phase[payload.channel.name]].ducks
            };
        }
        req.app.locals.current_phase[payload.channel.name] += 1;
    } else {
        req.app.locals.current_phase[payload.channel.name] = 0;
    }
    console.log(req.app.locals.scores);
    let msg = _.defaults({
    channel: payload.channel.name,
    attachments: [
      {
        title: "Correct answer. Score",
        color: "#2FA44G",
        text: req.app.locals.scores.toString(),
        mrkdwn_in: ["text"]
      }
    ]
    }, msgDefaults)

    res.set("content-type", "application/json")
    res.status(200).json({
      "response_type": "in_channel",
      "replace_original": false,
      "text": "Correct answer. You have " + req.app.locals.scores[payload.channel.name].ducks + " ducks"
    })

    setTimeout(send_next, 1500, payload);

    return
}

module.exports = { pattern: /answers/ig, handler: handler }
