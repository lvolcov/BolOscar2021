const sqlFunctions = require('../sqlResources/sqlFunctions')
const leftLeagueMessage = require('../../textsMenus/leftLeagueMessage')

const leftLeagueGetName = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id
    let notOwnLeague = []
    const info = await sqlFunctions.getLeaguesDetails(telegramID)
    info.map((elem) => elem.TelegramIDDono === elem.TelegramIDParticipante ? 0 : notOwnLeague.push(elem.NomeLiga))

    if (notOwnLeague[0]) {
        await ctx.telegram.sendMessage(ctx.chat.id, "Qual liga você deseja sair?", { reply_markup: { force_reply: true } })
        await ctx.telegram.sendMessage(ctx.chat.id, leftLeagueMessage(notOwnLeague),
            { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "leagues deleteLastMessage" }]] } })
    } else {
        await ctx.telegram.sendMessage(ctx.chat.id, 'Você não está participando de nenhuma liga.',
            { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "leagues" }]] } })
    }
})

module.exports = leftLeagueGetName