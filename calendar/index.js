const ics = require('ics')
import { gKey } from './config'
import { getRows, AsyncGSpread } from './helpers'
import { promisify } from 'util'
import { estimateDuration } from './duration'
import truncate from 'lodash/truncate'

const getStart = row => {
  const d = new Date(row['time'] + ' GMT')
  return [
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
  ]
}

/* space commas, wastes characters but helps with line breaks */
const sc = s => s.replace(/,/g, ', ')

const getDescription = ({ team, team_2, streams, format }) => {
  let d = ''
  d += `\n${sc(team)} x ${sc(team_2)}`
  d += `\n${format}`
  d += `\nStreams: ${sc(streams)}`
  d += `\n\nhttps://aoe2calendar.com`
  return d
}

const getTitle = ({ title, round, team, team_2 }) => {
  let t = `${title}: `
  t += truncate(sc(team), { length: 25 })
  t += ' x '
  t += truncate(sc(team_2), { length: 25 })
  t += ` [${round}]`
  return t
}

const buildEvent = row => ({
  start: getStart(row),
  duration: { minutes: estimateDuration(row) },
  title: getTitle(row),
  description: getDescription(row),
  url: 'https://aoe2calendar.com',
})

const calendar = async () => {
  const sheets = await AsyncGSpread({
    key: gKey,
  })

  const matchSheet = sheets.worksheets[0]
  const rows = await getRows(matchSheet.id)
  const events = rows.map(row => buildEvent(row))
  const ical = await ics.createEvents(events)
  if (ical['error']) {
    console.error(ical['error'])
  }
  return ical['value']
}

export default calendar
