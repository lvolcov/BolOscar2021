const changeNameMessage = ((nome) => {
    return `Seu atual nome no ranking é: <u>${nome}</u>.\n\n\
 - Seu novo nome precisa ter entre 6 a 15 caracteres \n\n\
 - Não pode conter caracteres especiais\n`
})

module.exports = changeNameMessage