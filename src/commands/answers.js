
'use strict'

const _ = require('lodash')
const request = require('request')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  icon_emoji: config('ICON_EMOJI')
}

const send_next = function(req, payload, channel_name) {
    if (typeof req.app.locals.phases[req.app.locals.current_phase[channel_name]] !== "undefined") {
        var message = req.app.locals.phases[req.app.locals.current_phase[channel_name]].message;
        message.replace_original = false;
        message.response_type = "in_channel";
        const postOptions = {
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
    }
}

const handler = (req, payload, res) => {
    console.log(req.app.locals.scores);
    var channel_name = payload.channel_name;
    if (typeof payload.channel !== "undefined") {
        channel_name = payload.channel.name;
    }
    console.log(req.app.locals.current_phase[channel_name]);
    res.set("content-type", "application/json")
    if (typeof req.app.locals.current_phase[channel_name] === "undefined") {
        req.app.locals.current_phase[channel_name] = 0;
        res.status(200).json({
          "response_type": "in_channel",
          "replace_original": false,
          "text": "Great answer!"
        })
        setTimeout(send_next, 1500, req, payload, channel_name);
    } else if (typeof req.app.locals.phases[req.app.locals.current_phase[channel_name]] !== "undefined") {
        var user_answer = "";
        if (payload.actions) {
            user_answer = payload.actions[0].name;
        } else if (typeof payload.text !== "undefined") {
            user_answer = payload.text.split(" ")[1];
        }
        if (req.app.locals.phases[req.app.locals.current_phase[channel_name]].answer === user_answer) {
            if (req.app.locals.scores[channel_name]) {
                req.app.locals.scores[channel_name].ducks += req.app.locals.phases[req.app.locals.current_phase[channel_name]].ducks;
            } else {
                req.app.locals.scores[channel_name] = {
                    "ducks": req.app.locals.phases[req.app.locals.current_phase[channel_name]].ducks
                };
            }
            req.app.locals.current_phase[channel_name] += 1;
            res.status(200).json({
                "response_type": "in_channel",
                "replace_original": false,
                "text": "Correct answer. You have " + (req.app.locals.scores[channel_name].ducks?req.app.locals.scores[channel_name].ducks:0) + " ducks"
            })
            setTimeout(send_next, 1500, req, payload, channel_name);
        } else {
            res.status(200).json({
                "response_type": "in_channel",
                "replace_original": false,
                "text": "Wrong Answer. Try again"
            })
        }
    } else {
        res.status(200).json({
            "response_type": "in_channel",
            "replace_original": false,
            "text": "You have finished the game. You have " + (req.app.locals.scores[channel_name].ducks?req.app.locals.scores[channel_name].ducks:0) + " ducks"
        })
    }



    return
}

module.exports = { pattern: /answers/ig, handler: handler }
