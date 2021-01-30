const changeNameMessage = require('../../textsMenus/changeNameMessage')
const validateAnswer = require('../validateAnswer')
const sqlFunctions = require('../sqlResources/sqlFunctions')

const newRankingName = (async (ctx) => {
    const telegramID = ctx.update.message.from.id
    const messageTextUser = ctx.update.message.text
    const validAnswer = validateAnswer(messageTextUser)
    if (validAnswer === true){
        ctx.telegram.sendMessage(ctx.chat.id, `Novo nome: ${messageTextUser} \n\nSalvar alteração?`, 
            {reply_markup: {inline_keyboard: [[{ text: 'Sim', callback_data: String('salvaNome '+ messageTextUser)}, { text: 'Não', callback_data: 'naoSalvaNome'}]]}})
    }else{
        const info = await sqlFunctions.getVotes(telegramID)
        ctx.telegram.sendMessage(ctx.chat.id, validAnswer)
            .then((result) => { setTimeout(() => {
                ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
                .then(async (result) => {
                    const nome = info[0].Nome
                    await ctx.telegram.sendMessage(ctx.chat.id, "Qual o seu novo nome para o Ranking?", {reply_markup: {force_reply: true, }})
                    await ctx.telegram.sendMessage(ctx.chat.id, changeNameMessage(nome),{parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "moreInfo deleteLastMessage"}]]}})
                })
                .catch(err => console.log(err))
            }, 3000)})
            .catch(err => console.log(err))
    }
})

module.exports = newRankingName