const BaseCommand = require("../../utils/structures/BaseCommand");

class SkipCommand extends BaseCommand {
    constructor() {
        super({
            name: "skip",
            description: "Skip the song thats currently playing",
            examples: ["skip"],
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
        if (!msg.guild.queue) return this.sender.invalid(msg, "I am currently not playing music in this server");
        if (msg.guild.queue.voiceChannel.id != vc.id) return this.sender.invalid(msg, `You need to be in the same channel in order to use this command`, 5000);

        // Skip the song
        try {
            msg.guild.queue.songs.shift();
            this.global.videoPlayer(msg.guild, msg.guild.queue.songs[0]);
            this.sender.success(msg, "The song has been skipped");
        } catch (err) {
            this.logger.error(err);
            this.sender.error(msg, "Something went wrong when trying to skip the song, please try again");
        }
    }
}

module.exports = SkipCommand;