const { isMuted } = require('../utils/mutes');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '❌ Ошибка при выполнении команды.', ephemeral: true });
            }
        }
    }
};
