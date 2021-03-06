import express from 'express'
import calendar from './calendar'

const ics = require('ics')

const app = express()
app.get('/ical', async (req, res) => {
  const ical = await calendar()
  res.send(ical)
})
app.listen(process.env.PORT || 3000, () =>
  console.log('Serving ical on port 3000'),
)
