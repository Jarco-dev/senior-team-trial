const BaseCommand = require("../../utils/structures/BaseCommand");
const ytdl = require("ytdl-core");

class PlayCommand extends BaseCommand {
    constructor() {
        super({
            name: "play",
            aliases: ["p"],
            description: "Pick a song to play in your current voice channel",
            args: "<url>",
            examples: ["play https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
            cooldown: 3000,
            disableDm: true,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"]
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
        if (msg.guild.queue && msg.guild.queue.voiceChannel.id != vc.id) {
            if (msg.guild.queue.voiceChannel.id != vc.id) return this.sender.invalid(msg, `You need to be in the same channel in order to use this command`, 5000);
        }

        // Bot can join the channel
        const channelPerms = vc.permissionsFor(msg.client.user);
        const neededPerms = ["VIEW_CHANNEL", "CONNECT", "SPEAK"];
        for (let i in neededPerms) {
            if (!channelPerms.has(neededPerms[i])) {
                this.sender.error(msg, `The bot doesn't have the \`${neededPerms[i]}\` permission in ${vc}, Please contact your server admin!`, 5000);
                return;
            }
        }

        // Song argument
        if (!msg.args[0]) return this.sender.invalid(msg, "You need to provide a video to play!", 5000);
        if (ytdl.validateURL(msg.args[0])) {
            const result = await ytdl.getInfo(msg.args[0]);
            var song = { title: result.videoDetails.title, url: result.videoDetails.video_url };
        }
        if (!song) return this.sender.invalid(msg, `That link doesn't seem to be something I can play, please try again`, 5000);

        if (!msg.guild.queue) {
            // Join the channel and play the song
            msg.guild.queue = {
                voiceChannel: vc,
                textChannel: msg.channel,
                connection: null,
                dispatcher: null,
                playing: false,
                songs: []
            };
            msg.guild.queue.songs.push(song);

            try {
                msg.guild.queue.connection = await vc.join();
                msg.guild.queue.connection.voice.setSelfDeaf(true);
                msg.guild.queue.connection.on("disconnect", () => {
                    delete msg.guild.queue
                });
                this.global.videoPlayer(msg.guild, song);
            } catch (err) {
                this.logger.error(err);
                delete msg.guild.queue;
                this.sender.error(msg, "Something went wrong while trying to join the voice channel, please try again", 5000);
            }
        } else {
            // Add song to to the queue
            msg.guild.queue.songs.push(song);
            this.sender.success(msg, `**${song.title}** has been added to the queue`);
        }
    }
}

module.exports = PlayCommand;