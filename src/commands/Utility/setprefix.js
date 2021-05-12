const BaseCommand = require("../../utils/structures/BaseCommand");

class SetPrefixCommand extends BaseCommand {
    constructor() {
        super({
            name: "setprefix",
            description: "Change the servers prefix for the bot",
            args: "<prefix>",
            examples: ["setprefix ,"],
            cooldown: 3000,
            disableDm: true,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]
        });
    }

    /**
     * Run the command
     * @param {import("discord.js").Message} msg - The message
     */
    async run(msg) {
        // Checks if the user has permission
        await msg.member.fetch();
        if (!msg.member.permissions.has("ADMINISTRATOR")) return this.sender.invalid(msg, "You need the `ADMINISTRATOR` permission to use this command", 5000);

        // Handle the new prefix argument
        if (!msg.args[0]) return this.sender.invalid(msg, "Please provide a new prefix", 5000);
        if (msg.args[0].length > 10) return this.sender.invalid(msg, "A prefix can't be longer than 10 character", 5000);
        if (msg.args[0] == msg.prefix) return this.sender.invalid(msg, `The prefix is already set to \`${msg.prefix}\``, 5000);

        // Set the new prefix
        try {
            this.db.GuildConfigs.update({ prefix: msg.args[0] }, { where: { guildId: msg.guild.id } });
            msg.guild.prefix = msg.args[0];
            this.sender.success(msg, `The prefix has been updated to \`${msg.guild.prefix}\``);
        } catch (err) {
            this.logger.error(err);
            this.sender.error(msg, "Something went wrong while setting the prefix, please try again", 5000);
        }
    }
}

module.exports = SetPrefixCommand;