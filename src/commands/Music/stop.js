const BaseCommand = require("../../utils/structures/BaseCommand");

class StopCommand extends BaseCommand {
    constructor() {
        super({
            name: "stop",
            aliases: ["disconnect", "dc"],
            description: "Stop the music if any is playing",
            examples: ["stop"],
            cooldown: 3000,
            disableDm: true,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES"]
        });

        /** @private */
        this.waveEmoji = this.config.emoji.wave;
    }

    /**
     * Run the command
     * @param {import("discord.js").Message} msg - The message
     */
    async run(msg) {
        // Is in a voice channel 
        await msg.member.fetch();
        const vc = msg.member.voice.channel;
        if (!vc) return this.sender.invalid(msg, "You need to be in a voice channel to do this", 5000);
        if (!msg.guild.queue) return this.sender.invalid(msg, "I am currently not playing music in any channel", 5000);
        if (msg.guild.queue.voiceChannel.id != vc.id) return this.sender.invalid(msg, `You need to be in the same channel in order to use this command`, 5000);

        // Stop the music and leave the channel
        try {
            msg.guild.queue.voiceChannel.leave();
            delete msg.guild.queue;
            this.sender.send(msg, `${this.waveEmoji} **|** The bot has been disconnected`);
        } catch (err) {
            this.logger.error(err);
            this.sender.error(msg, "Something went wrong when trying to stop the queue, please try again");
        }
    }
}

module.exports = StopCommand;