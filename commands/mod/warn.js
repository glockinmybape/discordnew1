const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const warns = new Map();
const MOD_ROLE_ID = '1432073576579600638';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('⚠️ Выдать предупреждение пользователю')
    .addUserOption(option =>
      option.setName('пользователь')
        .setDescription('Кому выдать предупреждение')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('причина')
        .setDescription('Причина предупреждения')
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

    const userWarns = warns.get(user.id) || 0;
    const newCount = userWarns + 1;
    warns.set(user.id, newCount);

    const embed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('⚠️ Предупреждение')
      .setDescription(`${user} получил предупреждение (${newCount}/3)\nПричина: **${reason}**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    if (newCount >= 3) {
      await member.timeout(5 * 60 * 60 * 1000, '3 предупреждения');
      warns.set(user.id, 0);
      await interaction.followUp({ content: `⛔ ${user} получил мут на 5 часов за 3 предупреждения.` });
    }
  },
};
