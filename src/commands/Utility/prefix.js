const BaseCommand = require("../../utils/structures/BaseCommand");

class PrefixCommand extends BaseCommand {
    constructor() {
        super({
            name: "prefix",
            description: "Shows the prefix of the channel / server you're in",
            examples: ["prefix"],
            cooldown: 3000,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]
        });
    }

    /**
     * Run the command
     * @param {import("discord.js").Message} msg - The message
     */
    run(msg) {
        const prefixEmbed = this.global.embed()
            .setTitle(`The prefix in this server/channel is \`${msg.prefix}\``);
        this.sender.send(msg, prefixEmbed);
    }
}

module.exports = PrefixCommand;