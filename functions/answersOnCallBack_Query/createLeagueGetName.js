const createLeagueMessage = require('../../textsMenus/createLeagueMessage')

const createLeagueGetName = (async (ctx) => {

    await ctx.telegram.sendMessage(ctx.chat.id, "Qual será o nome da sua liga?", { reply_markup: { force_reply: true } })

    await ctx.telegram.sendMessage(ctx.chat.id, createLeagueMessage(), {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "leagues deleteLastMessage" }]] }
    })
})

module.exports = createLeagueGetName