const numPlayers = ({ team, team_2 }) =>
  team.split(',').length + team_2.split(',').length

const estimateGameDuration = ({ team, team_2, title }) => {
  const players = numPlayers({ team, team_2 })
  let fixed = 15
  if (title.includes('DM')) fixed = 0
  if (title.includes('Arena')) fixed = 20
  if (title.includes('BF')) fixed = 20
  const additionalMinutesPerPlayer = 5
  return fixed + players * additionalMinutesPerPlayer
}

export const estimateDuration = row => {
  try {
    const perGame = estimateGameDuration(row)
    const waitBetweenGames = 5
    let numGames = 5
    if (row.format.toLowerCase().includes('best')) {
      const percentPlayed = 0.65
      numGames = parseInt(row.format.match(/\d+/)[0]) * percentPlayed
    }
    if (row.format.toLowerCase().includes('all')) {
      numGames = parseInt(row.format.match(/\d+/)[0])
    }
    if (row.format.match(/\d+s/)) {
      numGames = numPlayers(row) / 2
    }

    return Math.round(perGame * numGames + waitBetweenGames * numGames)
  } catch (error) {
    console.error(error)
    return 60
  }
}
