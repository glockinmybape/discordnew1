const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Пройти верификацию и получить роль.'),
    async execute(interaction) {
        const verifyChannelId = '1432075544027070577';
        if (interaction.channel.id !== verifyChannelId) {
            return interaction.reply({ content: 'Эта команда работает только в канале для верификации.', ephemeral: true });
        }

        const role = interaction.guild.roles.cache.get('1432073324216717452'); // VERIFIED_ROLE
        if (!role) return interaction.reply({ content: 'Роль не найдена!', ephemeral: true });

        if (interaction.member.roles.cache.has(role.id)) {
            return interaction.reply({ content: 'Вы уже прошли верификацию!', ephemeral: true });
        }

        await interaction.member.roles.add(role);
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription('✅ Верификация пройдена! Роль выдана.');

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
