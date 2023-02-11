const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } = require('discord.js')
const { clone, Functions } = require('../../utils/utils')

module.exports = {
    description: 'Adds a new component row to the message.',
    usage: 'components',
    parameters: [
        {
            name: 'Components',
            description: 'Discord components such buttons, select menus, etc.',
            optional: 'false',
            defaultValue: 'none'
        }
    ],
    dontParse: [0],
    run: async (d, code) => {
        if (code == undefined) return new d.error("required", d, 'code')

        let actionRow = new ActionRowBuilder()

        let actionRowData = clone(d)
        actionRowData.functions = new Functions(actionRowData.functions)
        .set('addStringSelectMenu', {
            dontParse: [2],
            async run(d, placeholder, customId, options, min = '1', max, disabled = 'false') {
                if (placeholder == undefined) return new d.error("required", d, 'placeholder')
                if (customId == undefined) return new d.error("required", d, 'custom ID')
                if (options == undefined) return new d.error("required", d, 'options')
        
                if (isNaN(min) || Number(min) < 1) return new d.error("invalid", d, 'min values', min);
                if ((isNaN(max) || Number(max) < Number(min)) && max != undefined) return new d.error("invalid", d, 'max values', max);
        
                let selectMenu = new StringSelectMenuBuilder()
                .setPlaceholder(placeholder)
                .setCustomId(customId)
                .setMinValues(Number(min))
                .setDisabled(disabled === 'true')
        
                if (max != undefined) selectMenu.setMaxValues(Number(max))
        
                let optionsData = clone(d)
                optionsData.functions = new Functions(optionsData.functions).set('addoption', { 
                    run: async (d, label, description, value, defaultOption = 'false', emoji) => {
                        if (label == undefined) return new d.error("required", d, 'label')
                        if (value == undefined) return new d.error("required", d, 'value')
        
                        let selectMenuOption = new StringSelectMenuOptionBuilder()
                        .setLabel(label)
                        .setValue(value)
                        .setDefault(defaultOption === 'true')
        
                        if (description != undefined) selectMenuOption.setDescription(description)
                        if (emoji != undefined) selectMenuOption.setEmoji(emoji)
        
                        selectMenu.addOptions(selectMenuOption)
                    }
                })
        
                await options.parse(optionsData, true)
                d.err = optionsData.err
                if (d.err) return;
                d.data = optionsData.data
        
                actionRow.addComponents(selectMenu)
            }
        })
        .set('addUserSelectMenu', {
            async run(d, placeholder, customId, min = '1', max, disabled = 'false') {
                if (placeholder == undefined) return new d.error("required", d, 'placeholder')
                if (customId == undefined) return new d.error("required", d, 'custom ID')
        
                if (isNaN(min) || Number(min) < 1) return new d.error("invalid", d, 'min values', min);
                if ((isNaN(max) || Number(max) < Number(min)) && max != undefined) return new d.error("invalid", d, 'max values', max);
        
                let selectMenu = new UserSelectMenuBuilder()
                .setPlaceholder(placeholder)
                .setCustomId(customId)
                .setMinValues(Number(min))
                .setDisabled(disabled === 'true')
        
                if (max != undefined) selectMenu.setMaxValues(Number(max))
        
                actionRow.addComponents(selectMenu)
            }
        })
        .set('addChannelSelectMenu', {
            dontParse: [2],
            async run(d, placeholder, customId, options, min = '1', max, disabled = 'false') {
                if (placeholder == undefined) return new d.error("required", d, 'placeholder')
                if (customId == undefined) return new d.error("required", d, 'custom ID')
        
                if (isNaN(min) || Number(min) < 1) return new d.error("invalid", d, 'min values', min);
                if ((isNaN(max) || Number(max) < Number(min)) && max != undefined) return new d.error("invalid", d, 'max values', max);
        
                let selectMenu = new ChannelSelectMenuBuilder()
                .setPlaceholder(placeholder)
                .setCustomId(customId)
                .setMinValues(Number(min))
                .setDisabled(disabled === 'true')
        
                if (max != undefined) selectMenu.setMaxValues(Number(max))
                if(options != undefined) {
                    let optionsData = clone(d)
                    optionsData.functions = new Functions(optionsData.functions).set('setchanneltypes', { 
                        run: async (d, ...types) => {
                            if (types == undefined) return new d.error("required", d, 'channel types')
                            let channelTypes = types
                            selectMenu.setChannelTypes(channelTypes)
                        }
                    })
        
                    await options.parse(optionsData, true)
                    d.err = optionsData.err
                    if (d.err) return;
                    d.data = optionsData.data
                }
        
                actionRow.addComponents(selectMenu)
            }
        })
        .set('addButton', {
            async run(d, style, label, customId, disabled = 'false', emoji) {
                if (style == undefined) return new d.error("required", d, 'style type')
                if (customId == undefined) return new d.error("required", d, 'custom ID')
        
                let styles = {
                    PRIMARY: ButtonStyle.Primary,
                    SECONDARY: ButtonStyle.Secondary,
                    SUCCESS: ButtonStyle.Success,
                    DANGER: ButtonStyle.Danger,
                    LINK: ButtonStyle.Link
                }
        
                style = styles[style.toUpperCase()]
        
                if (style == undefined) return new d.error("invalid", d, 'style', style)
        
                let button = new ButtonBuilder()
                .setStyle(style)
                .setDisabled(disabled === 'true')

                if (label != undefined) button.setLabel(label)
                if (emoji != undefined) button.setEmoji(emoji)
        
                if (style === styles.LINK) button.setURL(customId)
                else button.setCustomId(customId)
        
                actionRow.addComponents(button)
            }
        })

        await code.parse(actionRowData)
        d.err = actionRowData.err
        if (d.err) return;
        d.data = actionRowData.data

        d.data.message.components.push(actionRow)
    }
}