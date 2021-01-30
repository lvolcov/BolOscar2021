const resetVotes = (ctx) => {
    ctx.telegram.sendMessage(ctx.chat.id, "Tem certeza que deseja resetar seus palpites?", 
        {reply_markup: {inline_keyboard: [[{text : "Sim", callback_data: "resetVotesYes"}, {text : "Não", callback_data: "moreInfo"}]]}})
}

module.exports = resetVotes