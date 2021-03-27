const sharp = require('sharp');
var fs = require('fs');
var path = require("path");
const sqlFunctions = require('../sqlResources/sqlFunctions')
const db = require('../../db.json');

const choicesAll = (async (ctx) => {
    let returnSvg = fs.readFileSync(path.resolve(__dirname, './shareResources/choicesAll/choicesImg_light.svg')).toString()
    const telegramID = ctx.update.callback_query.from.id
    const info = await sqlFunctions.getVotes(telegramID)

    const winnersRaw = await sqlFunctions.getWinners()
    let winners = {}
    winnersRaw.map(elem => {
        winners[elem.Categoria] = { vencedor: elem.Vencedor, pontos: elem.Pontos, jaFoi: elem.JaFoi }
    })

    let pontos = 0
    Object.keys(info[0]).slice(4).map((elem, index) => {
        const rePoints = new RegExp(String('z' + index + 'abc'), "g");
        const reWord = new RegExp(String(elem + 'blank'), "g");
        const reColor = index < 10 ? new RegExp(String(index + 'f0000'), "g") : new RegExp(String(index + 'f000'), "g")

        //Passa o nome do palpite pra imagem
        if (info[0][elem] !== "0") {
            const result = db.categorias[elem].indicados[info[0][elem]].nomeCompleto.length > 19 ? String(db.categorias[elem].indicados[info[0][elem]].nomeCompleto.substring(0, 18) + '...') : db.categorias[elem].indicados[info[0][elem]].nomeCompleto
            returnSvg = returnSvg.replace(reWord, result)
        } else {
            returnSvg = returnSvg.replace(reWord, '')
        }

        //Passa a pontuacao ou o erro ou a interrogacao pra imagem
        if (info[0][elem] !== "0" && winners[elem].vencedor === db.categorias[elem].indicados[info[0][elem]].nomeResumido) {
            returnSvg = returnSvg.replace(rePoints, String(db.categorias[elem].peso))
            returnSvg = returnSvg.replace(reColor, '866d0d')
            pontos += db.categorias[elem].peso
        } else if (info[0][elem] == "0") {
            returnSvg = returnSvg.replace(rePoints, '')
        } else if (winners[elem].jaFoi === 'N') {
            returnSvg = returnSvg.replace(rePoints, ' ?')
            returnSvg = returnSvg.replace(reColor, '000000')
        } else {
            returnSvg = returnSvg.replace(rePoints, ' X')
            returnSvg = returnSvg.replace(reColor, 'ff0000')
        }
        return 0
    })

    pontos = ("    " + pontos).slice(-4)
    returnSvg = returnSvg.replace('pontosTotal', String(pontos))
    let choicesImg64 = fs.readFileSync(path.resolve(__dirname, './shareResources/choicesAll/choicesImg64.txt')).toString()
    returnSvg = returnSvg.replace('COLAchoicesImg64', choicesImg64)

    let checkCertoErradoImg64 = fs.readFileSync(path.resolve(__dirname, './shareResources/choicesAll/checkCertoErradoImg64.txt')).toString()
    returnSvg = returnSvg.replace('COLAcheckCertoErradoImg64', checkCertoErradoImg64)

    await sharp(Buffer.from(returnSvg), { density: 200 })
        .jpeg()
        .toBuffer()
        .then(async photo => {
            await ctx.telegram.sendPhoto(ctx.chat.id, { source: Buffer.from(photo) }, { reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "shareMenu" }]] } })
        })
})

module.exports = choicesAll