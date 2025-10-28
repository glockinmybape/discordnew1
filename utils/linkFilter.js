// Отслеживание количества нарушений по ссылкам
const linkViolations = new Map(); // userId -> { count, lastTime }

function recordViolation(userId) {
    const now = Date.now();
    const record = linkViolations.get(userId) || { count: 0, lastTime: 0 };

    // Если прошло больше 10 минут с последнего нарушения — сброс счётчика
    if (now - record.lastTime > 10 * 60 * 1000) {
        record.count = 1;
    } else {
        record.count += 1;
    }

    record.lastTime = now;
    linkViolations.set(userId, record);
    return record.count;
}

module.exports = { recordViolation };
