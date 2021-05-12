const BaseCommand = require("../../utils/structures/BaseCommand");

class PauseCommand extends BaseCommand {
    constructor() {
        super({
            name: "pause",
            description: "Pause the currently playing music",
            examples: ["pause"],
            cooldown: 3000,
            disableDm: true,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES"]
        });
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
        if (!msg.guild.queue) return this.sender.invalid(msg, "I am currently not playing any music in this server", 5000);
        if (msg.guild.queue.voiceChannel.id != vc.id) return this.sender.invalid(msg, `You need to be in the same channel in order to use this command`, 5000);

        // Music is playing paused
        if (!msg.guild.queue.playing) this.sender.invalid(msg, `The music is already paused, user \`${msg.prefix}resume\` to start it again`, 5000);

        // Pause the music
        try {
            msg.guild.queue.dispatcher.pause();
            msg.guild.queue.playing = false;
            this.sender.success(msg, "The music has been paused");
        } catch (err) {
            this.logger.error(err);
            this.sender.error(msg, "Something went wrong while trying to pause the song, please try again");
        }
    }
}

module.exports = PauseCommand;