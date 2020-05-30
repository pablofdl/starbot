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
    let payload = JSON.parse(req.body.payloaf)
    console.log(payload)

    answers.handler(req, payload, res)
    return
})


app.listen(config('PORT'), (err) => {
    if (err) throw err

    app.locals.scores = {};

    console.log(`\n🚀  Starbot LIVES on PORT ${config('PORT')} 🚀`)

    if (config('SLACK_TOKEN')) {
        console.log(`🤖  beep boop: @starbot is real-time\n`)
        bot.listen({ token: config('SLACK_TOKEN') })
    }
})
