/**
 * Cooldown
 * The class that handles with command cooldowns
 */
class Cooldown {
    /**
     * Constructor
     * @param {Client} client - The client instance
     */
    constructor(client) {
        /** @private */
        this.client = client;

        /** @private */
        this.logger = client.logger;

        /** @private */
        this.sender = client.sender;

        /** @private */
        this.timeEmoji = client.config.emoji.time;

        this.cooldown = {};
    }

    /**
     * Check if the user is on cooldown or not
     * @param {Message} msg - The initiating message
     * @param {Command} command - The requested command
     * @return {Boolean}
     */
    check(msg, command) {
        const key = `${command.name}_${msg.author.id}`;

        if (this.cooldown[key]) {
            let channelPerms = (msg.guild) ? msg.channel.permissionsFor(this.client.user.id) : "NotInGuild";
            if (channelPerms.has("VIEW_CHANNEL") && channelPerms.has("SEND_MESSAGES")) {
                const diff = this.cooldown[key] - Date.now();
                const timeleft = (diff / 1000).toFixed(1);
                this.sender.reply(msg, this.timeEmoji, `Please wait ${timeleft}s and try again`, diff);
            }
            return true;
        } else {
            this.cooldown[key] = Date.now() + command.cooldown;
            setTimeout(() => delete this.cooldown[key], command.cooldown);
            return false;
        }
    }
}

module.exports = Cooldown;

/**
 * @typedef {import("../Bot")} Client
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("./structures/BaseCommand")} Command
 */