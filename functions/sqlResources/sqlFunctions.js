const changeName = require('./changeName')
const createLeague = require('./createLeague')
const createNewUser = require('./createNewUser')
const deleteVotes = require('./deleteVotes')
const getLeaguesDetails = require('./getLeaguesDetails')
const getLeaguesList = require('./getLeaguesList')
const getNamesExistingLeagues = require('./getNamesExistingLeagues')
const getVotes = require('./getVotes')
const joinLeague = require('./joinLeague')
const postVote = require('./postVote')
const updateWinnersTable = require('./updateWinnersTable')
const getLeaguesAmountUsers = require('./getLeaguesAmountUsers')
const getLeaguesOwner = require('./getLeaguesOwner')
const changeLeaguePrivacy = require('./changeLeaguePrivacy')
const changeLeagueName = require('./changeLeagueName')
const getLeaguePlayersList = require('./getLeaguePlayersList')
const leftLeague = require('./leftLeague')
const getPublicLeaguesInfo = require('./getPublicLeaguesInfo')
const getPrivacy = require('./getPrivacy')
const getWinners = require('./getWinners')
const updatePoints = require('./updatePoints')
const setPointstoZero = require('./setPointstoZero')
const getLeaguePlayersListByLeagueName = require('./getLeaguePlayersListByLeagueName')

module.exports = {
    changeName,
    createLeague,
    createNewUser,
    deleteVotes,
    getLeaguesDetails,
    getLeaguesList,
    getNamesExistingLeagues,
    getVotes,
    joinLeague,
    postVote,
    updateWinnersTable,
    getLeaguesAmountUsers,
    getLeaguesOwner,
    changeLeaguePrivacy,
    changeLeagueName,
    getLeaguePlayersList,
    leftLeague,
    getPublicLeaguesInfo,
    getPrivacy,
    getWinners,
    updatePoints,
    setPointstoZero,
    getLeaguePlayersListByLeagueName,
}