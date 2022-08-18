let data = null;
module.exports = {
    get: () => {
        return data;
    },
    create: (hero) => {
        return data = Object.assign({}, hero);
    },
    update: (hero) => {
        return data = Object.assign({}, hero);
    }
}

