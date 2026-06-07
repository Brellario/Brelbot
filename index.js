// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
require('dotenv').config();
const token = process.env.TOKEN;

const { QUESTIONS, CURRENT_PATCH } = require('./commands/utility/feedback');
// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            }
        }
    }

    if (interaction.isModalSubmit() && interaction.customId === 'feedbackModal') {
        const name = interaction.fields.getTextInputValue('nameInput');
        const patch = interaction.fields.getTextInputValue('patchInput');

        // Find the forum channel
        const forumChannel = interaction.guild.channels.cache.find(
            c => c.name === 'feedback-brelbot' && c.type === 15 // 15 = GuildForum
        );

        if (!forumChannel) {
            await interaction.reply({ content: 'Could not find the feedback forum channel!', flags: MessageFlags.Ephemeral });
            return;
        }

        // Create a forum post
        const thread = await forumChannel.threads.create({
            name: `${name} - ${patch}`,
            message: { content: QUESTIONS[0] }
        });

        await interaction.reply({ content: `Thanks ${name}! Your feedback thread has been created. Please head over there to answer a few questions.`, flags: MessageFlags.Ephemeral });

        // Collect answers one by one
        let questionIndex = 1;

        const collector = thread.createMessageCollector({ filter: m => !m.author.bot });

        collector.on('collect', async () => {
            if (questionIndex < QUESTIONS.length) {
                await thread.send(QUESTIONS[questionIndex]);
                questionIndex++;
            } else {
                await thread.send('Thank you for feedback! Feel free to continue to use this channel for additional feedback or conversations on this patch. If you wish to leave feedback on a future patch, please use the `/feedback` command again.');
                collector.stop();
            }
        });
    }
});

// Log in to Discord with your client's token
client.login(token);