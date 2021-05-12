const BaseEvent = require("../../utils/structures/BaseEvent");

class MessageEvent extends BaseEvent {
    constructor() {
        super("message");

        /** @private */
        this.logger = this.client.logger;

        /** @private */
        this.levels = this.client.levels

        /** @private */
        this.commands = this.client.commandLoader.commands;

        /** @private */
        this.commandAliases = this.client.commandLoader.commandAliases;

        /** @private */
        this.cooldown = this.client.cooldown;
    }

    /**
     * Run the event
     * @param {Message} msg - The discord message object
     */
    async run(msg) {
        // Isn't a bot
        if (msg.author.bot) return;

        // Add xp if not on cooldown
        this.levels.addXp(msg);

        // Check for the prefix
        if (!msg.guild && msg.content.startsWith(this.config.prefix)) {
            var prefix = this.config.prefix;
        } else if (msg.guild && msg.content.startsWith(await msg.guild.fetchPrefix())) {
            var prefix = msg.guild.prefix;
        } else if (msg.content.startsWith(`<@!${this.client.user.id}>`)) {
            var prefix = `<@!${this.client.user.id}>`;
        } else {
            return;
        }

        // Prepare the args and prefix parameter
        msg.args = msg.content.slice(prefix.length).trim().split(/\s+/);

        // Run the command tests
        const commandName = msg.args.shift().toLowerCase();
        let command = this.commands[commandName];
        if (!command) {
            command = this.commands[this.commandAliases[commandName]];
            if (!command) return;
        }

        if (msg.guild) {
            const channelPerms = msg.channel.permissionsFor(this.client.user.id);
            msg.prefix = msg.guild.prefix;

            // deleteMsg
            if (command.deleteMsg) {
                if (channelPerms.has("VIEW_CHANNEL") && channelPerms.has("MANAGE_MESSAGES")) {
                    msg.delete().catch(err => { });
                }
            }

            // permissions
            for (let i in command.permissions) {
                if (!channelPerms.has(command.permissions[i])) {
                    if (channelPerms.has("VIEW_CHANNEL") && channelPerms.has("SEND_MESSAGES")) {
                        this.sender.error(msg, `The bot doesn't have the \`${command.permissions[i]}\` permission in ${msg.channel}, Please contact your server admin!`, 5000);
                    }
                    return;
                }
            }

            // nsfw
            if (command.nsfw && !msg.channel.nsfw) {
                if (channelPerms.has("VIEW_CHANNEL") && channelPerms.has("SEND_MESSAGES")) {
                    this.sender.invalid(msg, "This command can only be used in **nsfw** channels!", 5000);
                    return;
                }
            }

        } else {
            msg.prefix = this.config.prefix;

            // disableDm
            if (command.disableDm) {
                this.sender.error(msg, "This command is disabled in my dm's!", 5000);
                return;
            }
        }

        // User isn't on cooldown
        if (command.cooldown > 0 && this.cooldown.check(msg, command)) return;

        // Run the command
        try {
            command.run(msg);
        } catch (err) {
            this.logger.error(err);
            this.sender.error(msg, "An unexpected error occured, the command might have not worked fully!", 5000).catch();
        }
    }
}

module.exports = MessageEvent;

/**
 * @typedef {import("discord.js").Message} Message
 */