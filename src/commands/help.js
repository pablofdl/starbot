
"use strict"

const _ = require("lodash")
const config = require("../config")

const msgDefaults = {
  response_type: "in_channel",
  username: "Gripper AI",
  icon_emoji: config("ICON_EMOJI")
}

let attachments = [
  {
    title: "Test Message",
    color: "#2FA44F",
    text: "`/gripquiztest random_fact` returns a random fact \n`/gripquiztest game` Play the gripper's game",
    mrkdwn_in: ["text"]
  }
]

const handler = (req, payload, res) => {
  let msg = _.defaults({
    channel: payload.channel_name,
    attachments: attachments
  }, msgDefaults)

  res.set("content-type", "application/json")
  res.status(200).json(msg)
  return
}

module.exports = { pattern: /help/ig, handler: handler }
