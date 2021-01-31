const validateAnswer = ((answer) => {
    
    const format = /[^a-z0-9 ]/gi;
    if (answer.length > 16){
        return '❌ Nome muito longo ! ❌'
    }else if (answer.length < 6) {
        return '❌ Nome muito curto ! ❌'
    }else if (format.test(answer)) {
        return '❌ Nome contendo caracteres especiais ❌'
    }else{
        return true
    }
})

module.exports = validateAnswer