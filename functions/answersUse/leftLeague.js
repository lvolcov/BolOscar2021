const validateAnswer = require('../validateAnswer')
const sqlFunctions = require('../sqlResources/sqlFunctions')
const leftLeagueMessage = require('../../textsMenus/leftLeagueMessage')

const leftLeague = (async (ctx) => {
    const telegramID = ctx.update.message.from.id
    const messageTextUser = ctx.update.message.text
    let validAnswer = validateAnswer(messageTextUser)
    let notOwnLeague = []
    let upperNotOwnLeague = []
    let ownLeague

    if (validAnswer === true) {
        const info = await sqlFunctions.getLeaguesDetails(telegramID)
        info.map((elem) => elem.TelegramIDDono === elem.TelegramIDParticipante ? ownLeague = elem.NomeLiga.toUpperCase() : notOwnLeague.push(elem.NomeLiga))
        upperNotOwnLeague = notOwnLeague.map((elem) => elem.toUpperCase())
        upperNotOwnLeague.indexOf(messageTextUser.toUpperCase()) === -1 ? validAnswer = "❌ Você não participa de nenhuma liga com este nome. ❌" : ""
        ownLeague === messageTextUser.toUpperCase() ? validAnswer = "❌ Você não pode sair da sua própria liga. ❌" : ""
    }
    if (validAnswer === true) {
        ctx.telegram.sendMessage(ctx.chat.id, `Confirmar sua saída da liga ${notOwnLeague[upperNotOwnLeague.indexOf(messageTextUser.toUpperCase())]}?`,
            { reply_markup: { inline_keyboard: [[{ text: 'Sim', callback_data: String('leftLeagueYes ' + notOwnLeague[upperNotOwnLeague.indexOf(messageTextUser.toUpperCase())]) }, { text: 'Não', callback_data: 'leagues' }]] } })
    } else {
        ctx.telegram.sendMessage(ctx.chat.id, validAnswer)
            .then((result) => {
                setTimeout(() => {
                    ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
                        .then(async (result) => {
                            await ctx.telegram.sendMessage(ctx.chat.id, "Qual liga você deseja sair?", { reply_markup: { force_reply: true } })
                            await ctx.telegram.sendMessage(ctx.chat.id, leftLeagueMessage(notOwnLeague),
                                { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "leagues deleteLastMessage" }]] } })
                        })
                        .catch(err => console.log(err))
                }, 3000)
            })
            .catch(err => console.log(err))
    }
})

module.exports = leftLeague