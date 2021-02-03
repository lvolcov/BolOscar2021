const sqlFunctions = require('../sqlResources/sqlFunctions')

const manageLeagues = (async (ctx) => {
    const called = ctx.update.callback_query.data.split(" ", 2)[0]
    const previousInfo = ctx.update.callback_query.data.split(" ").slice(1)
    const telegramID = ctx.update.callback_query.from.id

    if (previousInfo[0] === "changeTo") {
        await sqlFunctions.changeLeaguePrivacy(telegramID, previousInfo[1])
        const privacy = previousInfo[1] == 0 ? "Pública 🌎" : "Privada 🔑"
        ctx.answerCbQuery(called, { text: `✅ Sua liga agora é ${privacy}!`, show_alert: true })
    } else if (previousInfo[0] && previousInfo[0] !== "deleteLastMessage") {
        await sqlFunctions.changeLeagueName(telegramID, previousInfo.join(" "))
        ctx.answerCbQuery(called, { text: `✅ Nome da sua liga foi alterado para ${previousInfo.join(" ")}!`, show_alert: true })
    }

    const info = await sqlFunctions.getLeaguesDetails(telegramID)
    let ownLeague = []
    info.map((elem) => elem.TelegramIDDono === elem.TelegramIDParticipante ? ownLeague.push(elem) : 0)

    const infoMenu = [[{ text: 'Alterar o nome', callback_data: 'changeLeagueNameGetName' }, { text: 'Participantes', callback_data: 'leaguePlayersList' }]]
    ownLeague[0].Privada === 0 ? infoMenu.push([{ text: 'Tornar sua Liga Pública 🌎', callback_data: 'manageLeagues changeTo 1' }]) : infoMenu.push([{ text: 'Tornar sua Liga Privada 🔑', callback_data: 'manageLeagues changeTo 0' }])


    infoMenu.push([{ text: '⇦   ⇦   ⇦   Voltar para Ligas', callback_data: 'leagues' }])
    ctx.telegram.sendMessage(ctx.chat.id, String("Gerenciar liga " + ownLeague[0].NomeLiga + ":"), { reply_markup: { inline_keyboard: infoMenu } })
})

module.exports = manageLeagues