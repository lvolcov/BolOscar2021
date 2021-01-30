const start = require('./start')
const cat = require('./answersOnCallBack_Query/cat')
const ind = require('./answersOnCallBack_Query/ind')
const volCategoria = require('./answersOnCallBack_Query/volCategoria')
const voted = require('./answersOnCallBack_Query/voted')
const menuInicial = require('./answersOnCallBack_Query/menuInicial')
const moreInfo = require('./answersOnCallBack_Query/moreInfo')
const salvaNome = require('./answersOnCallBack_Query/moreInfo')
const naoSalvaNome = require('./answersOnCallBack_Query/moreInfo')
const votesList = require('./answersOnCallBack_Query/votesList')
const pointsCat = require('./answersOnCallBack_Query/pointsCat')
const resetVotes = require('./answersOnCallBack_Query/resetVotes')
const resetVotesYes = require('./answersOnCallBack_Query/resetVotesYes')
const changeName = require('./answersOnCallBack_Query/changeName')
const leagues = require('./answersOnCallBack_Query/leagues')
const naoCriaLiga = require('./answersOnCallBack_Query/leagues')
const criaLiga = require('./answersOnCallBack_Query/leagues')
const joinLeagueYes = require('./answersOnCallBack_Query/leagues')
const createLeagueGetName = require('./answersOnCallBack_Query/createLeagueGetName')
const joinLeague = require('./answersOnCallBack_Query/joinLeague')
const leftLeague = require('./answersOnCallBack_Query/leftLeague')
const manageLeague = require('./answersOnCallBack_Query/manageLeague') 
const checkLeagues = require('./answersOnCallBack_Query/checkLeagues')
const createLeagueName = require('./answersUse/createLeagueName')
const joinLeagueName = require('./answersUse/joinLeagueName')
const newRankingName = require('./answersUse/newRankingName')


module.exports = {
    start,
    cat, 
    ind, 
    volCategoria, 
    voted, 
    menuInicial, 
    moreInfo, 
    salvaNome,
    naoSalvaNome,
    votesList, 
    pointsCat, 
    resetVotes, 
    resetVotesYes, 
    changeName, 
    leagues,
    naoCriaLiga,
    criaLiga,
    joinLeagueYes,
    createLeagueGetName, 
    joinLeague, 
    leftLeague, 
    manageLeague, 
    checkLeagues,
    createLeagueName,
    joinLeagueName,
    newRankingName,
}

