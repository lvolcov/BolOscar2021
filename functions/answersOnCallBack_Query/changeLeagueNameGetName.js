const sqlFunctions = require('../sqlResources/sqlFunctions')
const changeNameLeagueMessage = require('../../textsMenus/changeNameLeagueMessage')

const changeLeagueNameGetName = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id
    const info = await sqlFunctions.getLeaguesDetails(telegramID)
    let OwnLeague = []
    info.map((elem) => elem.TelegramIDDono === elem.TelegramIDParticipante ? OwnLeague.push(elem) : 0)

    await ctx.telegram.sendMessage(ctx.chat.id, "Qual será o novo nome da sua liga?", { reply_markup: { force_reply: true, } })
    await ctx.telegram.sendMessage(ctx.chat.id, changeNameLeagueMessage(OwnLeague[0].NomeLiga), {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "manageLeagues deleteLastMessage" }]] }
    })
})

module.exports = changeLeagueNameGetName