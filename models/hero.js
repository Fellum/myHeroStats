const data = [];
module.exports = {
    get: (key) => {
        return data[key - 1];
    },
    create: (hero) => {
        return data.push(hero);
    }
}

