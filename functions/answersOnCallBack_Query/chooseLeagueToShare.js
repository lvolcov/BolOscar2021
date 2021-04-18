const sqlFunctions = require('../sqlResources/sqlFunctions')
const db = require('../../db.json');

const chooseLeagueToShare = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id
    const info = await sqlFunctions.getLeaguesList(telegramID)

    const menu = []

    info.map((elem, index) => {
        menu.push([{ text: elem, callback_data: String("leagueRanking " + String(elem)) }])
        return 0
    })
    menu.push([{ text: '⇦   ⇦   ⇦   Voltar', callback_data: 'shareMenu' }])
    info.length == 0 ? ctx.telegram.sendMessage(ctx.chat.id, "Você ainda não está participando de nenhuma liga.", { reply_markup: { inline_keyboard: menu } }) : ctx.telegram.sendMessage(ctx.chat.id, "Selecione uma das ligas:", { reply_markup: { inline_keyboard: menu } })

})

module.exports = chooseLeagueToShare