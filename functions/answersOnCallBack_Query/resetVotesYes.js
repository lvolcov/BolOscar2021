const sqlFunctions = require('../sqlResources/sqlFunctions')
const moreInfo = require('./moreInfo');

const resetVotesYes = (async (ctx) => {
    const called = ctx.update.callback_query.data.split(" ", 2)[0]
    const telegramID = ctx.update.callback_query.from.id
    const info = await sqlFunctions.getVotes(telegramID)

    await sqlFunctions.deleteVotes(telegramID)
    await sqlFunctions.createNewUser(telegramID, info[0].NomeOriginal, info[0].Nome)

    ctx.answerCbQuery(called, {text : `✅ Palpites Resetados !`, show_alert : true})

    moreInfo(ctx)
})

module.exports = resetVotesYes