const xpMap = new Map();

function addXP(userId, amount) {
    const current = xpMap.get(userId) || 0;
    xpMap.set(userId, current + amount);
}

function getXP(userId) {
    return xpMap.get(userId) || 0;
}

module.exports = { addXP, getXP };
