'use strict'

const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const _ = require('lodash')
const config = require('./config')
const commands = require('./commands')
const answers = require('./game/answers')
const helpCommand = require('./commands/help')

let bot = require('./bot')

let app = express()

if (config('PROXY_URI')) {
    app.use(proxy(config('PROXY_URI'), {
        forwardPath: (req, res) => { return require('url').parse(req.url).path }
    }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n 👋 🌍 \n') })

app.post('/commands/starbot', (req, res) => {
    let payload = req.body
    console.log(payload)
    if (!payload || payload.token !== config('STARBOT_COMMAND_TOKEN')) {
        let err = '✋  Star—what? An invalid slash token was provided\n' +
        '   Is your Slack slash token correctly configured?'
        console.log(err)
        res.status(401).end(err)
        return
    }

    let cmd = _.reduce(commands, (a, cmd) => {
        return payload.text.match(cmd.pattern) ? cmd : a
    }, helpCommand)

    cmd.handler(payload, res)
})

app.post('/commands/answer', (req, res) => {

    console.log(req.body)
    let payload = JSON.parse(req.body.payload)
    console.log(payload)

    answers.handler(req, payload, res)
    return
})

app.post('/restart/channel', (req, res) => {

    let payload = req.body
    app.locals.current_phase[payload.channel] = 0;

    answers.handler(req, payload, res)
    return
})


app.listen(config('PORT'), (err) => {
    if (err) throw err

    app.locals.scores = {};
    app.locals.current_phase = {};
    app.locals.phases = [
        {
            "message": {
                "text": "Beginnings",
                "attachments": [
                    {
                        "text": "You will have to travel to Pablo's hometown. Where are you going?",
                        "fallback": "Shame... buttons aren't supported in this land",
                        "callback_id": "beginnings",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "image_url": "https://media.istockphoto.com/photos/yellow-rubber-duck-for-bath-time-picture-id185590965?k=6&m=185590965&s=612x612&w=0&h=8yL484l9GrTAmJXoCzeBwdow3ccOasut4G_AoOkPVoc=",
                        "actions": [
                            {
                                "name": "A Coruña",
                                "text": "A Coruña",
                                "type": "button",
                                "value": "A Coruña"
                            },
                            {
                                "name": "Some other place",
                                "text": "Some other place",
                                "type": "button",
                                "value": "Some other place"
                            }
                        ]
                    }
                ]
            },
            "answer": "A Coruña",
            "ducks": 0
        },
        {
            "message": {
                "text": "You have Found Pablo",
                "attachments": [
                    {
                        "text": "You will have to travel to Pablo's hometown. Where are you going?",
                        "fallback": "Shame... buttons aren't supported in this land",
                        "callback_id": "pablo_1",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "image_url": "https://viaturi.com/wp-content/uploads/2016/11/A-Coruna-bonita-y-hermosa.jpg",
                        "actions": [
                            {
                                "name": "A Coruña",
                                "text": "A Coruña",
                                "type": "button",
                                "value": "A Coruña"
                            },
                            {
                                "name": "Some other place",
                                "text": "Some other place",
                                "type": "button",
                                "value": "Some other place"
                            }
                        ]
                    }
                ]
            },
            "answer": "A Coruña",
            "ducks": 1
        }
    ];

    console.log(`\n🚀  Starbot LIVES on PORT ${config('PORT')} 🚀`)

    if (config('SLACK_TOKEN')) {
        console.log(`🤖  beep boop: @starbot is real-time\n`)
        bot.listen({ token: config('SLACK_TOKEN') })
    }
})
