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
const leftLeagueYes = require('./answersOnCallBack_Query/leagues')
const createLeagueGetName = require('./answersOnCallBack_Query/createLeagueGetName')
const joinLeague = require('./answersOnCallBack_Query/joinLeague')
const leftLeagueGetName = require('./answersOnCallBack_Query/leftLeagueGetName')
const manageLeagues = require('./answersOnCallBack_Query/manageLeagues')
const checkLeagues = require('./answersOnCallBack_Query/checkLeagues')
const changeLeagueNameGetName = require('./answersOnCallBack_Query/changeLeagueNameGetName')
const leaguePlayersList = require('./answersOnCallBack_Query/leaguePlayersList')
const publicLeagues = require('./answersOnCallBack_Query/publicLeagues')
const chooseLeagueToShare = require('./answersOnCallBack_Query/chooseLeagueToShare')

const createLeagueName = require('./answersUse/createLeagueName')
const joinLeagueName = require('./answersUse/joinLeagueName')
const newRankingName = require('./answersUse/newRankingName')
const changeLeagueName = require('./answersUse/changeLeagueName')
const leftLeague = require('./answersUse/leftLeague')

const choicesAll = require('./share/choicesAll')
const leagueRanking = require('./share/leagueRanking')
const shareMenu = require('./share/shareMenu')
const mainCategories = require('./share/mainCategories')

const adminMenu = require('./admin/adminMenu')
const updatePoints = require('./admin/updatePoints')


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
    leftLeagueYes,
    createLeagueGetName,
    joinLeague,
    leftLeague,
    manageLeagues,
    checkLeagues,
    createLeagueName,
    joinLeagueName,
    newRankingName,
    changeLeagueName,
    changeLeagueNameGetName,
    leaguePlayersList,
    leftLeagueGetName,
    publicLeagues,
    chooseLeagueToShare,
    choicesAll,
    shareMenu,
    mainCategories,
    leagueRanking,
    adminMenu,
    updatePoints,
}

