const { EmbedBuilder } = require('discord.js');

// Временное хранилище нарушений
const linkViolations = new Map();

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message.guild || message.author.bot) return;

        // Проверка на наличие ссылки
        const linkRegex = /(https?:\/\/[^\s]+)/gi;
        if (!linkRegex.test(message.content)) return;

        try {
            await message.delete().catch(() => {});

            const userId = message.author.id;
            const currentViolations = linkViolations.get(userId) || 0;
            const newViolations = currentViolations + 1;
            linkViolations.set(userId, newViolations);

            let muteDuration = 10 * 60 * 1000; // 10 минут
            let reason = 'Отправка ссылки (1 нарушение)';

            if (newViolations === 2) {
                muteDuration = 60 * 60 * 1000; // 1 час
                reason = 'Отправка ссылки (2 нарушение)';
            } else if (newViolations >= 3) {
                muteDuration = 24 * 60 * 60 * 1000; // 1 день
                reason = 'Отправка ссылки (3 нарушение)';
                linkViolations.set(userId, 0); // сброс после третьего раза
            }

            // Применяем тайм-аут
            await message.member.timeout(muteDuration, reason);

            // Формат времени для embed
            const durationText =
                muteDuration === 10 * 60 * 1000
                    ? '10 минут'
                    : muteDuration === 60 * 60 * 1000
                    ? '1 час'
                    : '24 часа';

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('🚫 Нарушение правил')
                .setDescription(
                    `Пользователь ${message.author} был временно замьючен за отправку ссылки.\n\n**Длительность:** ${durationText}\n**Причина:** ${reason}`
                )
                .setFooter({ text: 'Velarion Moderation System' })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });

            // Автоматическое снятие мута (в реальности Discord сам снимает, но пусть будет защита)
            setTimeout(() => {
                if (message.member.isCommunicationDisabled()) {
                    message.member.timeout(null, 'Автоматическое снятие мута').catch(() => {});
                }
            }, muteDuration + 5000);
        } catch (err) {
            console.error('Ошибка фильтра ссылок:', err);
        }
    },
};
