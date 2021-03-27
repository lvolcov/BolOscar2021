const sqlFunctions = require('../sqlResources/sqlFunctions')
const db = require('../../db.json');

const menuInicial = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id
    let info = await sqlFunctions.getVotes(telegramID)
    const menuInicial = []
    const voted = []

    Object.keys(info[0]).slice(4).map((elem, index) => {
        if (info[0][elem] !== "0") {
            voted.push([{
                text: String(db.categorias[elem].nomeMenu + ": " + db.categorias[elem].indicados[info[0][elem]].nomeCompleto),
                callback_data: String(db.categorias[elem].nomeResumido + " voltaMenuJaVotados")
            }])
        }
        return 0
    })

    if (String(telegramID) === process.env.TELEGRAM_ID_ALLOWED_1 || String(telegramID) === process.env.TELEGRAM_ID_ALLOWED_2) {
        menuInicial.push([{ text: "Menu Admin", callback_data: "adminMenu" }])
    }
    if (voted.length === 0) {
        menuInicial.push([{ text: "🎥   Iniciar os Palpites   🎥", callback_data: "volCategoria" }])
    } else if (voted.length === 23) {
        menuInicial.push([{ text: "Revisar Palpites", callback_data: "voted" }])
    } else {
        menuInicial.push([{ text: "Continuar Palpites", callback_data: "volCategoria" }, { text: "Revisar Palpites", callback_data: "voted" }])
    }

    menuInicial.push([{ text: "Ligas", callback_data: "leagues" }, { text: "Mais info", callback_data: "moreInfo" }], [{ text: "Compartilhar seus Palpites", callback_data: "shareMenu" }])
    ctx.telegram.sendMessage(ctx.chat.id, "Escolha uma das opções a seguir:", { reply_markup: { inline_keyboard: menuInicial } })
})

module.exports = menuInicial