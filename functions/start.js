const sqlFunctions = require('./sqlResources/sqlFunctions')
const db = require('../db.json');

const menuInicial = (async (ctx) => {
    //Closing date set to 26/04/2021 - 00:00 UTC
    const closingTime = new Date(Date.UTC(2021, 3, 26, 00, 00, 0, 0));
    const timeNow = Date.now()

    const telegramID = ctx.update.message.from.id
    const info = await sqlFunctions.getVotes(telegramID)
    const menuInicial = []
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
        menuInicial.push([{ text: "Menu Admin", callback_data: "adminMenu" }])
    }
    let menuSentence = "Palpites encerrados !"
    if (timeNow < closingTime) {
        menuSentence = "Escolha uma das opções a seguir:"
        if (voted.length === 0) {
            menuInicial.push([{ text: "🎥   Iniciar os Palpites   🎥", callback_data: "volCategoria" }])
        } else if (voted.length === 23) {
            menuInicial.push([{ text: "Revisar Palpites", callback_data: "voted" }])
        } else {
            menuInicial.push([{ text: "Continuar Palpites", callback_data: "volCategoria" }, { text: "Revisar Palpites", callback_data: "voted" }])
        }
    }
    menuInicial.push([{ text: "Ligas", callback_data: "leagues" }, { text: "Mais info", callback_data: "moreInfo" }], [{ text: "Compartilhar seu Bol'Oscar", callback_data: "shareMenu" }])
    await ctx.telegram.sendMessage(ctx.chat.id, menuSentence, { reply_markup: { inline_keyboard: menuInicial } })
})

module.exports = menuInicial