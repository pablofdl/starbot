
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (req, payload, res) => {
    if (req.app.locals.scores[payload.channel_name]) {
        req.app.locals.scores[payload.channel_name].ducks += 1;
    } else {
        req.app.locals.scores[payload.channel_name] = {
            "ducks": 1
        };
    }
    let msg = _.defaults({
    channel: payload.channel_name,
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
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /answers/ig, handler: handler }
