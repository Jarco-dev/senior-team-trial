const BaseCommand = require("../../utils/structures/BaseCommand");

class ResumeCommand extends BaseCommand {
    constructor() {
        super({
            name: "resume",
            description: "Resume the music after pausing it",
            examples: ["resume"],
            cooldown: 3000,
            disableDm: true,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES"]
        })
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
        if (!msg.guild.queue) return this.sender.invalid(msg, "I am currently not playing music in this server", 5000);
        if (msg.guild.queue.voiceChannel.id != vc.id) return this.sender.invalid(msg, `You need to be in the same channel in order to use this command`, 5000);

        // Music is paused
        if (msg.guild.queue.playing) return this.sender.invalid(msg, "The music is alreday playing, no need to resume", 5000);

        // Resume the music
        try {
            msg.guild.queue.dispatcher.resume();
            msg.guild.queue.playing = true;
            this.sender.success(msg, "The music has been resumed");
        } catch (err) {
            this.logger.error(err);
            this.sender.error(msg, "Something went wrong while trying to resume the music, please try again", 5000);
        }
    }
}

module.exports = ResumeCommand;