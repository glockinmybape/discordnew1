const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Показывает все доступные команды бота'),

    // Используем interaction.client, чтобы не передавать client вручную
    async execute(interaction) {
        const client = interaction.client;

        // Проверка, что client.commands существует
        if (!client.commands || client.commands.size === 0) {
            return interaction.reply({ content: '❌ Команды не найдены.', ephemeral: true });
        }

        // Получаем все команды и их категории
        const commands = client.commands.map(cmd => ({
            name: cmd.data.name,
            description: cmd.data.description || 'Нет описания',
            category: cmd.category || 'Прочее'
        }));

        // Группируем по категориям
        const categories = {};
        for (const cmd of commands) {
            if (!categories[cmd.category]) categories[cmd.category] = [];
            categories[cmd.category].push(cmd);
        }

        // Создаём embed
        const embed = new EmbedBuilder()
            .setTitle('📖 Справка по командам Velarion Bot')
            .setColor('Blue')
            .setTimestamp();

        // Добавляем поля по категориям
        for (const [category, cmds] of Object.entries(categories)) {
            embed.addFields([
                {
                    name: `💠 ${category}`,
                    value: cmds.map(c => `\`/${c.name}\` — ${c.description}`).join('\n'),
                    inline: false
                }
            ]);
        }

        // Отправляем пользователю как ephemeral, чтобы не засорять чат
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
