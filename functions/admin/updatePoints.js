
const sqlFunctions = require('../sqlResources/sqlFunctions')

const updatePoints = (async (ctx) => {
    const menuInicial = []
    const winners = await sqlFunctions.getWinners()
    await sqlFunctions.setPointstoZero()

    winners.map((elem) => {
        if (elem.Vencedor !== 'vencedor') {
            sqlFunctions.updatePoints(elem.Categoria, elem.Vencedor, elem.Pontos)
        }
    })

    menuInicial.push([{ text: "Voltar", callback_data: "adminMenu" }])
    ctx.telegram.sendMessage(ctx.chat.id, "PONTOS RECALCULADOS !", { reply_markup: { inline_keyboard: menuInicial } })
})

module.exports = updatePoints