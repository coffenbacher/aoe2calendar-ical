import { gKey } from './config'
import GSpread from 'google-spreadsheets'
import { promisify } from 'util'
import { isObjectLike } from 'lodash'

export const AsyncGSpread = promisify(GSpread)
export const asyncGSpreadRows = promisify(GSpread.rows)

const cleanGSpreadRow = row => {
  // Wipe out weird $t objects that appear in empty cells, default to '' instead
  for (let [key, value] of Object.entries(row)) {
    if (isObjectLike(value) && value['$t'] !== undefined) {
      row[key] = ''
    }
  }

  return row
}

export const getRows = async (worksheetId, keyName) => {
  let rows = await asyncGSpreadRows({ key: gKey, worksheet: worksheetId })
  rows = rows.map(cur => cleanGSpreadRow(cur))
  return rows
}
