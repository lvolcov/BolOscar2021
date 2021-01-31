const sqlFunctions = require('../sqlResources/sqlFunctions')
const table = require("table"); 

const checkLeagues = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id
    const userLeagues = await sqlFunctions.getLeaguesList(telegramID)
    const leaguesInfo = await sqlFunctions.getLeaguesAmountUsers()
    const message = [['\nLigas', 'Número de Participantes']]
    
    leaguesInfo.map((elem) => {
        if (userLeagues.indexOf(elem.NomeLiga) !== -1) {
            message.push([elem.NomeLiga, elem.Participantes])
        }
    })

    const config = {border: table.getBorderCharacters('ramac'), columns: {0: {width: 12,wrapWord: true},1: {width: 15, alignment: 'center', wrapWord: true}}}
    const messageTable = String("<pre>" + table.table(message, config) + "</pre>"); 
    
    await ctx.telegram.sendMessage(ctx.chat.id, String("Suas Ligas:\n\n"+messageTable),
        {parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "leagues"}]]}})
})

module.exports = checkLeagues