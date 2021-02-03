const validateAnswer = require('../validateAnswer')
const sqlFunctions = require('../sqlResources/sqlFunctions')

const changeLeagueName = (async (ctx) => {
    const telegramID = ctx.update.message.from.id
    const messageTextUser = ctx.update.message.text
    let validAnswer = validateAnswer(messageTextUser)

    if (validAnswer === true) {
        const validLeagues = await sqlFunctions.getNamesExistingLeagues()
        const upperValidLeagues = validLeagues.map((elem) => elem.toUpperCase())
        upperValidLeagues.indexOf(messageTextUser.toUpperCase()) !== -1 ? validAnswer = "❌ Nome de liga já está sendo usado ❌" : ""
    }
    if (validAnswer === true) {
        ctx.telegram.sendMessage(ctx.chat.id, `Confirmar "${messageTextUser}" como novo nome da sua liga?`,
            { reply_markup: { inline_keyboard: [[{ text: 'Sim', callback_data: String('manageLeagues ' + messageTextUser) }, { text: 'Não', callback_data: 'manageLeagues' }]] } })
    } else {
        ctx.telegram.sendMessage(ctx.chat.id, validAnswer)
            .then((result) => {
                setTimeout(() => {
                    ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
                        .then(async (result) => {
                            const info = await sqlFunctions.getLeaguesDetails(telegramID)
                            let OwnLeague = []
                            info.map((elem) => elem.TelegramIDDono === elem.TelegramIDParticipante ? OwnLeague.push(elem) : 0)
                            await ctx.telegram.sendMessage(ctx.chat.id, "Qual será o novo nome da sua liga?", { reply_markup: { force_reply: true, } })
                            await ctx.telegram.sendMessage(ctx.chat.id, changeNameLeagueMessage(OwnLeague[0].NomeLiga), {
                                parse_mode: 'HTML',
                                reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "manageLeagues deleteLastMessage" }]] }
                            })
                        })
                        .catch(err => console.log(err))
                }, 3000)
            })
            .catch(err => console.log(err))
    }
})

module.exports = changeLeagueName