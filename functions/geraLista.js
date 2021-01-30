function geraLista (items) {
    const result = []
    let i = 0
    items.sort((a,b) => (a.text.length > b.text.length) ? 1 : ((b.text.length > a.text.length) ? -1 : 0));
    while (i < items.length){
        if (items[i+1] === undefined){
            result.push([items[i]])
        } else if (items[i].text.length > 20 || items[i+1].text.length > 20){
            result.push([items[i]])
            result.push([items[i+1]])
        } else {
            result.push([items[i], items[i+1]])
        }
        i += 2
    }
    return result
}

module.exports = geraLista