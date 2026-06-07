const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const rest = new REST().setToken(token);

(async () => {
    // What config values are actually loaded?
    console.log('clientId:', clientId);
    console.log('guildId:', guildId);
    console.log('token starts with:', token?.slice(0, 10));

    // What does Discord think is registered right now?
    const registered = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
    console.log('Currently registered commands:', JSON.stringify(registered, null, 2));
})();