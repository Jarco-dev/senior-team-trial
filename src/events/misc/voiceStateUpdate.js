const BaseEvent = require("../../utils/structures/BaseEvent");

class VoiceStateUpdateEvent extends BaseEvent {
    constructor() {
        super("voiceStateUpdate");

        /** @private */
        this.bellEmoji = this.config.emoji.bell;
    }

    /**
     * Run the event
     * @param {VoiceState} oldState - The old voice state 
     * @param {VoiceState} newState - The new voice state
     */
    run(oldState, newState) {
        if (oldState.id == this.client.user.id && newState.guild.queue && newState.guild.queue.voiceChannel != newState.channelID) {
            newState.guild.queue.voiceChannel = newState.channel;
            this.sender.msgChannel(newState.guild.queue.textChannel, `${this.bellEmoji} **|** I've been moved to ${newState.channel}, I will now see this as the music channel`);
        }
    }
}

module.exports = VoiceStateUpdateEvent;

/**
 * @typedef {import("discord.js").VoiceState} VoiceState
 */