require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

// Загружаем все команды
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(folder => {
    const folderPath = path.join(commandsPath, folder);
    fs.readdirSync(folderPath).forEach(file => {
        const command = require(`./commands/${folder}/${file}`);
        commands.push(command.data.toJSON());
    });
});

// Инициализация REST
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Регистрируем команды на сервере
(async () => {
    try {
        console.log('🔄 Регистрируем (обновляем) Slash-команды...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash-команды успешно зарегистрированы!');
    } catch (error) {
        console.error(error);
    }
})();
