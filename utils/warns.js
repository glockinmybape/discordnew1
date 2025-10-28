const { addMute } = require('./mutes');

const warns = new Map(); // userId -> количество предупреждений

function addWarn(userId) {
    const count = warns.get(userId) || 0;
    const newCount = count + 1;
    warns.set(userId, newCount);
    return newCount;
}

function resetWarn(userId) {
    warns.delete(userId);
}

function getWarns(userId) {
    return warns.get(userId) || 0;
}

// Автоматический мут на 5 часов
function muteIfNeeded(userId) {
    const count = getWarns(userId);
    if (count >= 3) {
        addMute(userId, 5 * 60 * 60 * 1000); // 5 часов в миллисекундах
        resetWarn(userId); // сбросить предупреждения
        return true;
    }
    return false;
}

module.exports = { addWarn, getWarns, resetWarn, muteIfNeeded };
