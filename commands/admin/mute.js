const { SlashCommandBuilder } = require('discord.js');

const MOD_ROLE_ID = '1432073576579600638';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('🔇 Замьютить участника на указанное время')
    .addUserOption(option =>
      option.setName('пользователь')
        .setDescription('Кого замьютить')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('время')
        .setDescription('Длительность мута (например: 10m, 1h, 1d)')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ У вас нет прав использовать эту команду.', ephemeral: true });
    }

    const user = interaction.options.getUser('пользователь');
    const duration = interaction.options.getString('время');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '⚠️ Пользователь не найден.', ephemeral: true });

    const timeMap = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return interaction.reply({ content: '❌ Неверный формат времени. Пример: 10m, 1h, 1d', ephemeral: true });

    const ms = parseInt(match[1]) * timeMap[match[2]];
    await member.timeout(ms, `Мут от ${interaction.user.tag}`);

    return interaction.reply(`🔇 ${user} замьючен на **${duration}**.`);
  },
};
