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
}