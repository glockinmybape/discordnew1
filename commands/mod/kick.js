const { SlashCommandBuilder } = require('discord.js');

const MOD_ROLE_ID = '1432073576579600638';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('👢 Кикнуть пользователя с сервера')
    .addUserOption(option =>
      option.setName('пользователь')
        .setDescription('Кого кикнуть')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('причина')
        .setDescription('Причина кика')
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ У вас нет прав использовать эту команду.', ephemeral: true });
    }

    const user = interaction.options.getUser('пользователь');
    const reason = interaction.options.getString('причина') || 'Без причины';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ content: '⚠️ Пользователь не найден.', ephemeral: true });

    await member.kick(reason);
    return interaction.reply(`👢 ${user} был кикнут. Причина: **${reason}**`);
  },
};
