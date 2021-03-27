const validateAnswer = require('../validateAnswer')
const sqlFunctions = require('../sqlResources/sqlFunctions')

const joinLeagueName = (async (ctx) => {
    const messageTextUser = ctx.update.message.text
    const telegramID = ctx.update.message.from.id
    let validAnswer = validateAnswer(messageTextUser)
    let leagueJoined = ''

    if (validAnswer === true) {
        const validLeagues = await sqlFunctions.getNamesExistingLeagues()
        const upperValidLeagues = validLeagues.map((elem) => elem.toUpperCase())
        upperValidLeagues.indexOf(messageTextUser.toUpperCase()) === -1 ? validAnswer = "❌ Liga não encontrada! ❌" : leagueJoined = validLeagues[upperValidLeagues.indexOf(messageTextUser.toUpperCase())]
        const listLeaguesUser = await sqlFunctions.getLeaguesList(telegramID)
        listLeaguesUser.indexOf(leagueJoined) !== -1 ? validAnswer = "❌ Você já está participando dessa liga! ❌" : ""
    }
    if (validAnswer === true) {
        ctx.telegram.sendMessage(ctx.chat.id, `Confirmar a sua entrada na Liga ${leagueJoined}?`,
            { reply_markup: { inline_keyboard: [[{ text: 'Sim', callback_data: String('joinLeagueYes ' + leagueJoined) }, { text: 'Não', callback_data: 'leagues' }]] } })
    } else {
        ctx.telegram.sendMessage(ctx.chat.id, validAnswer)
            .then((result) => {
                setTimeout(() => {
                    ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
                        .then(async (result) => {
                            await ctx.telegram.sendMessage(ctx.chat.id, "Qual o nome da Liga que você deseja participar?", { reply_markup: { force_reply: true } })
                            await ctx.telegram.sendMessage(ctx.chat.id, "Escreva o nome exato da liga que você deseja ingressar.", { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "leagues deleteLastMessage" }]] } })
                        })
                        .catch(err => console.log(err))
                }, 3000)
            })
            .catch(err => console.log(err))
    }
})

module.exports = joinLeagueName