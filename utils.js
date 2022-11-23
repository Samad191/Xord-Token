const getAlphabets = (n) => {
    return String.fromCharCode('A'.charCodeAt() + n) 
}

function getMonth(monthStr){
    return new Date(monthStr+'-1-01').getMonth()+1
}


module.exports = {
    getAlphabets,
    getMonth,
}