
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {
    if (SCORES[payload.channel_name]) {
        SCORES[payload.channel_name].ducks += 1;
    } else {
        SCORES[payload.channel_name] = {
            "ducks": 1
        };
    }
    let msg = _.defaults({
    channel: payload.channel_name,
    attachments: [
      {
        title: "Correct answer. Score",
        color: "#2FA44G",
        text: SCORES.toString(),
        mrkdwn_in: ["text"]
      }
    ]
    }, msgDefaults)

    res.set("content-type", "application/json")
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /answers/ig, handler: handler }
