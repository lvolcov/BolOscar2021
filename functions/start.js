const sqlFunctions = require('./sqlResources/sqlFunctions')
const db = require('../db.json');

const menuInicial = (async (ctx) => {
    const telegramID = ctx.update.message.from.id
    const info = await sqlFunctions.getVotes(telegramID)
    const menuInicialBotoes = []
    const voted = []
    let nome
    if (info.length === 0) {
        nome = String(ctx.update.message.from.first_name === undefined ? telegramID : ctx.update.message.from.first_name) + " " + String(ctx.update.message.from.last_name === undefined ? '' : ctx.update.message.from.last_name)
        await sqlFunctions.createNewUser(telegramID, nome, nome);
    } else {
        nome = info[0].Nome
        Object.keys(info[0]).slice(4).map((elem, index) => {
            info[0][elem] !== "0" ? voted.push([{ text: String(db.categorias[elem].nomeMenu + ": " + db.categorias[elem].indicados[info[0][elem]].nomeCompleto), callback_data: String(db.categorias[elem].nomeResumido + " voltaMenuJaVotados") }]) : ""
            return 0
        })
    }
    if (String(telegramID) === process.env.TELEGRAM_ID_ALLOWED_1 || String(telegramID) === process.env.TELEGRAM_ID_ALLOWED_2) {
        menuInicialBotoes.push([{ text: "Menu Admin", callback_data: "adminMenu" }])
    }
    voted.length === 0 ? menuInicialBotoes.push([{ text: "🎥   Iniciar os Palpites   🎥", callback_data: "volCategoria" }]) : menuInicialBotoes.push([{ text: "Continuar Palpites", callback_data: "volCategoria" }, { text: "Revisar Palpites", callback_data: "voted" }])
    menuInicialBotoes.push([{ text: "Ligas", callback_data: "leagues" }, { text: "Mais info", callback_data: "moreInfo" }], [{ text: "Compartilhar", callback_data: "shareMenu" }])
    await ctx.telegram.sendMessage(ctx.chat.id, "Escolha uma das opções a seguir:", { reply_markup: { inline_keyboard: menuInicialBotoes } })
})

module.exports = menuInicial