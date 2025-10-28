require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} = require('discord.js');
const { addMute, isMuted, removeMute } = require('./utils/mutes');

// Создаем клиента
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// ==== 🧩 Загрузка команд ====
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`✅ Загружена команда: ${command.data.name}`);
    } else {
      console.log(`⚠️ Команда ${filePath} пропущена (нет data или execute).`);
    }
  }
}

// ==== 🚀 Когда бот готов ====
client.once('clientReady', c => {
  console.log(`🤖 ${c.user.tag} готов к работе!`);
});

// ==== ⚙️ Обработка команд ====
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  console.log(`📩 Получена команда: ${interaction.commandName} от ${interaction.user.tag}`);

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.log(`❌ Команда ${interaction.commandName} не найдена.`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(`💥 Ошибка при выполнении команды ${interaction.commandName}:`, error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction
        .reply({ content: '❌ Ошибка при выполнении команды.', flags: 64 })
        .catch(() => {});
    } else {
      await interaction
        .followUp({ content: '❌ Ошибка при выполнении команды.', flags: 64 })
        .catch(() => {});
    }
  }
});

// ==== 🧱 Анти-ссылочная система (авто-мут) ====
const userViolations = new Map();

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  if (urlPattern.test(message.content)) {
    await message.delete().catch(() => {});

    const userId = message.author.id;
    let strikes = userViolations.get(userId) || 0;
    strikes++;
    userViolations.set(userId, strikes);

    // Наказание по количеству
    let muteTime = 10 * 60 * 1000; // 10 минут
    if (strikes === 2) muteTime = 60 * 60 * 1000; // 1 час
    else if (strikes >= 3) muteTime = 24 * 60 * 60 * 1000; // 24 часа

    if (isMuted(userId)) return; // если уже в муте, не дублируем

    addMute(userId, muteTime);
    setTimeout(() => removeMute(userId), muteTime);

    const embed = new EmbedBuilder()
      .setTitle('🚫 Запрещено отправлять ссылки')
      .setDescription(
        `**${message.author.tag}**, вы получили мут на ${
          strikes === 1
            ? '10 минут'
            : strikes === 2
            ? '1 час'
            : '24 часа'
        } за отправку ссылки.\n\nПовторные нарушения увеличат срок наказания.`
      )
      .setColor('Red')
      .setTimestamp();

    try {
      await message.channel
        .send({ embeds: [embed] })
        .then(msg => setTimeout(() => msg.delete().catch(() => {}), 10000));
    } catch (err) {
      console.error('Ошибка при отправке уведомления о муте:', err);
    }
  }

  // Проверяем, замучен ли пользователь
  if (isMuted(message.author.id)) {
    await message.delete().catch(() => {});
  }
});

// ==== ⚙️ Логирование ошибок ====
process.on('unhandledRejection', err => {
  console.error('❗ Необработанная ошибка:', err);
});
process.on('uncaughtException', err => {
  console.error('💥 Критическая ошибка:', err);
});

// ==== 🔑 Запуск ====
client.login(process.env.TOKEN);
