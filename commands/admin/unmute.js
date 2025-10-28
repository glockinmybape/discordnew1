const { SlashCommandBuilder } = require('discord.js');

const MOD_ROLE_ID = '1432073576579600638';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('🔊 Снять мут с участника')
    .addUserOption(option =>
      option.setName('пользователь')
        .setDescription('Кого размьютить')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ У вас нет прав использовать эту команду.', ephemeral: true });
    }

    const user = interaction.options.getUser('пользователь');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '⚠️ Пользователь не найден.', ephemeral: true });

    await member.timeout(null);
    return interaction.reply(`🔊 ${user} был размьючен.`);
  },
};
