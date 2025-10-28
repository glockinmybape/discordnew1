// Простая система хранения мутов в памяти
const mutedUsers = new Map(); // userId -> timestamp окончания мута

function addMute(userId, duration) {
    const now = Date.now();
    mutedUsers.set(userId, now + duration);

    // Снимаем мут автоматически по таймеру
    setTimeout(() => mutedUsers.delete(userId), duration);
}

function isMuted(userId) {
    const muteTime = mutedUsers.get(userId);
    if (!muteTime) return false;
    return Date.now() < muteTime;
}

function removeMute(userId) {
    mutedUsers.delete(userId);
}

module.exports = { addMute, isMuted, removeMute };
