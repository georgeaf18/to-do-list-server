const date = {
    getToday: () => {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
}

module.exports = date;