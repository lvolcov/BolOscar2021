const sharp = require('sharp');
var fs = require('fs');
var path = require("path");
const sqlFunctions = require('../sqlResources/sqlFunctions')

const mainCategories = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id
    const info = await sqlFunctions.getVotes(telegramID)

    const dados = [info[0]["catFilme"], info[0]["catDirecao"], info[0]["catAtor"], info[0]["catAtriz"]]

    if (dados.indexOf('0') != -1) {
        ctx.telegram.sendMessage(ctx.chat.id, "Para gerar essa imagem, você precisa ter palpitado nas categorias: \n - Melhor Filme \n - Melhor Direção \n - Melhor Ator \n - Melhor Atriz", { reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "shareMenu" }]] } })
    } else {
        const imgFields = ['MelhorFilmeIMG', 'MelhorDiretorIMG', 'MelhorAtorIMG', 'MelhorAtrizIMG']
        let returnSvg = fs.readFileSync(path.resolve(__dirname, './shareResources/mainCategories/mainCategories.svg')).toString()

        dados.map((elem, index) => {
            const Img64 = fs.readFileSync(path.resolve(__dirname, String(`./shareResources/mainCategories/${elem}.txt`))).toString()
            returnSvg = returnSvg.replace(imgFields[index], Img64)
        })

        await sharp(Buffer.from(returnSvg), { density: 200 })
            .jpeg()
            .toBuffer()
            .then(async photo => {
                await ctx.telegram.sendPhoto(ctx.chat.id, { source: Buffer.from(photo) }, { reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "shareMenu" }]] } })
            })
    }
})

module.exports = mainCategories