const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
require('./src/database')
const User = require('./src/models/User')
const UserLog = require('./src/models/UserLog')

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route('/api/users')
  .get((req, res) => {
    User.find().select('_id username').exec((err, result) => {
      if (err && err !== null) {
        res.json({ error: "Unable to retrieve data" })
        return;
      }
      res.json(result)
    })
  })
  .post(bodyParser.urlencoded({ extended: false }), (req, res) => {
    User.create({ username: req.body.username }, (err, data) => {
      if (err && err !== null) {
        res.json({ error: "Unable to create the user" })
        return;
      }
      res.json({ _id: data._id, username: data.username })
    })
  })

app.post('/api/users/:_id/exercises', bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const user = await User.findById(req.params._id)
  if (!user || user === null) {
    res.json({ error: "Unable to find the user with _id :" + req.params._id })
    return;
  }

  const logData = {
    "description": req.body.description,
    "duration": req.body.duration,
  }
  if (req.body.date && req.body.date !== '')
    logData.date = req.body.date

  const log = new UserLog(logData)
  user.log.push(log)

  user.save((err, data) => {
    if (err && err !== null) {
      res.json({ error: "Unable to add log to user : " + user._id })
      return;
    }

    const resJson = {
      _id: user._id,
      username: user.username,
      description: log.description,
      duration: log.duration,
      date: new Date(log.date).toDateString(),
    }
    res.json(resJson)
  })
})

app.get('/api/users/:_id/logs', async (req, res) => {
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);
  const limit = req.query.limit

  const user = await User.findById(req.params._id).exec()

  let logs = user.log.filter(lg => {
    const date = new Date(lg.date)
    let filter = true;
    if (!isNaN(from)) {
      filter = filter && from <= date
    }
    if (!isNaN(to)) {
      filter = filter && to >= date
    }

    return filter
  })

  if (limit && limit !== '' && ! /[^\d]/.test(limit)) {
    logs = logs.slice(0, limit)
  }

  logs_all = [];
  for (let i = 0; i < logs.length; i++) {
    logs_all.push({
      description: logs[i].description,
      duration: logs[i].duration,
      date: (new Date(logs[i].date)).toDateString()
    })
  }

  const result = {
    _id: user._id,
    username: user.username,
    count: logs.length,
    log: logs_all
  }

  res.json(result)
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
