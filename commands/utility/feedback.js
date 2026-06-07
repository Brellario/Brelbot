const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const FORUM_CHANNEL_NAME = 'feedback-brelbot';
const CURRENT_PATCH = 'v0.3.0';

const QUESTIONS = [
    'Was the game easy enough to understand - i.e. did you have issues not knowing what to do? Do the tutorials need to be updated? etc.',
    'How was the pace of the game - too slow, too fast, or just right?',
    'How was the balancing of the game - too easy, too hard, or about right?',
    'How was the overall experience of playing this patch?',
    'Any additional comments?'
];

module.exports = {
    QUESTIONS,
    CURRENT_PATCH,
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Leave feedback on the current patch'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('feedbackModal')
            .setTitle('Leave Feedback');

        const nameInput = new TextInputBuilder()
            .setCustomId('nameInput')
            .setLabel('Your Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const patchInput = new TextInputBuilder()
            .setCustomId('patchInput')
            .setLabel('Patch Version')
            .setStyle(TextInputStyle.Short)
            .setValue(CURRENT_PATCH)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(patchInput)
        );

        await interaction.showModal(modal);
    }
};