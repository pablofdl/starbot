
'use strict'

const _ = require('lodash')
const request = require('request')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  icon_emoji: config('ICON_EMOJI')
}

const send_next = function(req, payload) {
    if (typeof req.app.locals.phases[req.app.locals.current_phase[payload.channel.name]] !== "undefined") {
        var message = req.app.locals.phases[req.app.locals.current_phase[payload.channel.name]].message;
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
    console.log(req.app.locals.current_phase[payload.channel.name]);
    res.set("content-type", "application/json")
    if (typeof req.app.locals.current_phase[payload.channel.name] === "undefined") {
        req.app.locals.current_phase[payload.channel.name] = 0;
        res.status(200).json({
          "response_type": "in_channel",
          "replace_original": false,
          "text": "Great answer!"
        })
        setTimeout(send_next, 1500, req, payload);
    } else if (typeof req.app.locals.phases[req.app.locals.current_phase[payload.channel.name]] !== "undefined") {
        var user_answer = payload.text.split(" ")[1];
        if (payload.actions) {
            user_answer = payload.actions[0].name;
        }
        if (req.app.locals.phases[req.app.locals.current_phase[payload.channel.name]].answer === payload.actions[0].name) {
            if (req.app.locals.scores[payload.channel.name]) {
                req.app.locals.scores[payload.channel.name].ducks += req.app.locals.phases[req.app.locals.current_phase[payload.channel.name]].ducks;
            } else {
                req.app.locals.scores[payload.channel.name] = {
                    "ducks": req.app.locals.phases[req.app.locals.current_phase[payload.channel.name]].ducks
                };
            }
            req.app.locals.current_phase[payload.channel.name] += 1;
            res.status(200).json({
                "response_type": "in_channel",
                "replace_original": false,
                "text": "Correct answer. You have " + (req.app.locals.scores[payload.channel.name].ducks?req.app.locals.scores[payload.channel.name].ducks:0) + " ducks"
            })
            setTimeout(send_next, 1500, req, payload);
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
            "text": "You have finished the game. You have " + (req.app.locals.scores[payload.channel.name].ducks?req.app.locals.scores[payload.channel.name].ducks:0) + " ducks"
        })
    }



    return
}

module.exports = { pattern: /answers/ig, handler: handler }
