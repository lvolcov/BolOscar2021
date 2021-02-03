const leftLeagueMessage = ((notOwnLeague) => {

    leagueNames = notOwnLeague.map((elem) => {
        return String(`- ${elem}`)
    }).join("\n")

    return `No momento você participa da${notOwnLeague.length > 1 ? 's seguintes ligas' : ' seguinte liga'}: \n\n${leagueNames}\n\n\Digite o exato nome da liga que você deseja sair.\n\n`
})

module.exports = leftLeagueMessage