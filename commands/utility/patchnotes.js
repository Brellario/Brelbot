const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('patchnotes')
        .setDescription('Post patch notes')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('patchNotesModal')
            .setTitle('Post Patch Notes');

        const versionInput = new TextInputBuilder()
            .setCustomId('versionInput')
            .setLabel('Version (e.g. v0.3.0)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const addedInput = new TextInputBuilder()
            .setCustomId('addedInput')
            .setLabel('Added')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const changedInput = new TextInputBuilder()
            .setCustomId('changedInput')
            .setLabel('Changed')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const fixedInput = new TextInputBuilder()
            .setCustomId('fixedInput')
            .setLabel('Fixed')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(versionInput),
            new ActionRowBuilder().addComponents(addedInput),
            new ActionRowBuilder().addComponents(changedInput),
            new ActionRowBuilder().addComponents(fixedInput)
        );

        await interaction.showModal(modal);
    }
};