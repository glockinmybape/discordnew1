const { SlashCommandBuilder } = require('discord.js');
const warns = new Map();
const MOD_ROLE_ID = '1432073576579600638';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('✅ Снять предупреждение у пользователя')
    .addUserOption(option =>
      option.setName('пользователь')
        .setDescription('С кого снять предупреждение')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ У вас нет прав использовать эту команду.', ephemeral: true });
    }

    const user = interaction.options.getUser('пользователь');
    const userWarns = warns.get(user.id) || 0;
    if (userWarns === 0) return interaction.reply({ content: '⚠️ У пользователя нет предупреждений.', ephemeral: true });

    warns.set(user.id, Math.max(userWarns - 1, 0));
    return interaction.reply(`✅ Предупреждение снято. Теперь у ${user} ${warns.get(user.id)} предупреждений.`);
  },
};
