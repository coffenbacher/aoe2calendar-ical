import calendar from './calendar'
import fs from 'fs'

calendar().then(result => {
  console.log(result)
  fs.writeFileSync('aoe2.ical', result)
})
