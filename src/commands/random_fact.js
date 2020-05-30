
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  as_user: false,
  icon_emoji: config('ICON_EMOJI')
}

const random_facts = [
    "Grip was founded in Denmark",
    "James hates cheese",
    "Pablo loves cheese"
]

const handler = (payload, res) => {
    const randomNumber = Math.floor(Math.random()*random_facts.length);
    let msg = _.defaults({
    channel: payload.channel_name,
    attachments: [
      {
        title: "Random Fact",
        color: "#2FA44G",
        text: "Did you know that " + random_facts[randomNumber] + "? https://www.youtube.com/watch?v=Bb4ackoZfdA",
        mrkdwn_in: ["text"]
      }
    ]
    }, msgDefaults)

    res.set("content-type", "application/json")
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /random_fact/ig, handler: handler }
