const validateAnswer = require('../validateAnswer')
const sqlFunctions = require('../sqlResources/sqlFunctions')

const createLeagueName = (async (ctx) => {
    const messageTextUser = ctx.update.message.text
    const telegramID = ctx.update.message.from.id
    let validAnswer = validateAnswer(messageTextUser)

    if (validAnswer === true){
        const validLeagues = await sqlFunctions.getNamesExistingLeagues()
        const upperValidLeagues = validLeagues.map((elem) => elem.toUpperCase())
        upperValidLeagues.indexOf(messageTextUser.toUpperCase()) !== -1 ? validAnswer = `❌ O nome ${messageTextUser} já está sendo usado! ❌` : ""
    }
    
    if (validAnswer === true){
        ctx.telegram.sendMessage(ctx.chat.id, `Você está criando uma liga com o nome: ${messageTextUser} \n\nDeseja salvar?`, 
            {reply_markup: {inline_keyboard: [[{ text: 'Sim', callback_data: String('criaLiga '+ messageTextUser)}, { text: 'Não', callback_data: 'naoCriaLiga'}]]}})
    }else{
        ctx.telegram.sendMessage(ctx.chat.id, validAnswer)
            .then((result) => { setTimeout(() => {
                ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
                .then(async (result) => {
                    await ctx.telegram.sendMessage(ctx.chat.id, "Qual será o nome da sua liga?", {reply_markup: {force_reply: true, }})
                    await ctx.telegram.sendMessage(ctx.chat.id, "MENSAGEM FALANDO SOBRE CRIAR LIGA",{parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "leagues deleteLastMessage"}]]}})
                })
                .catch(err => console.log(err))
            }, 3000)})
            .catch(err => console.log(err))
    }
})

module.exports = createLeagueName