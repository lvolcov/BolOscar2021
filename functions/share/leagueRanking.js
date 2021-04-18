const sharp = require('sharp');
var fs = require('fs');
var path = require("path");
const sqlFunctions = require('../sqlResources/sqlFunctions')

const leagueRanking = (async (ctx) => {
    let returnSvg = fs.readFileSync(path.resolve(__dirname, './shareResources/leagueRanking/leagueRanking_light.svg')).toString()

    const leagueName = ctx.update.callback_query.data.split(" ").slice(1).join(" ")
    const info = await sqlFunctions.getLeaguePlayersListByLeagueName(leagueName)

    const reLeagueName = new RegExp("      nameLeague      ", "g");
    returnSvg = returnSvg.replace(reLeagueName, String(" ".repeat(Math.round((26 - leagueName.length) / 2)) + leagueName + " ".repeat(Math.round((20 - leagueName.length) / 2))))

    for (let index = 0; index < 10; index++) {
        const reName = new RegExp(String('p' + index + 'p - Palpiteiro'), "g");
        const rePoints = new RegExp(String('pontoS' + index + 'S'), "g");

        if (info.length > index) {
            returnSvg = returnSvg.replace(reName, String(index + 1 + " - " + info[index].Nome))
            returnSvg = returnSvg.replace(rePoints, String(info[index].Pontos))
        } else {
            returnSvg = returnSvg.replace(reName, "")
            returnSvg = returnSvg.replace(rePoints, "")
        }
    }
    let ColaImg64 = fs.readFileSync(path.resolve(__dirname, './shareResources/leagueRanking/leagueRanking64.txt')).toString()
    returnSvg = returnSvg.replace('ColaImg64', ColaImg64)

    await sharp(Buffer.from(returnSvg), { density: 200 })
        .jpeg()
        .toBuffer()
        .then(async photo => {
            await ctx.telegram.sendPhoto(ctx.chat.id, { source: Buffer.from(photo) }, { reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "shareMenu" }]] } })
        })
})

module.exports = leagueRanking