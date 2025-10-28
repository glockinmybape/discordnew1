const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const channel = member.guild.channels.cache.get('1432075319191408753'); // #welcome
        if (!channel) return;

        // Выдать базовую роль
        const baseRole = member.guild.roles.cache.get('1432073422149648394');
        if (baseRole) member.roles.add(baseRole).catch(console.error);

        // Embed приветствия
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Добро пожаловать в Velarion!')
            .setDescription(`Привет, <@${member.id}>! Для полной роли используй команду **/verify**.`)
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};
