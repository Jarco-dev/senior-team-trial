module.exports = {

    // The bots default prefix (Will only change it for new guilds and dm's)
    "prefix": ".",

    // Embed colors
    "colors": {
        "default": "ff4800",
        "good": "00ff00",
        "bad": "ff0000"
    },

    // Emojis used by the bot
    "emoji": {
        "success": "✅",
        "invalid": "❌",
        "error": "⚠",
        "time": "⏱",
        "repeat": "🔁",
        "heartbeat": "💟",
        "music": "🎶",
        "wave": "👋",
        "next": "➡",
        "back": "⬅",
        "bell": "🔔"
    },

    debug: true,

    // Discord.js client options
    "clientOptions": {
        "messageEditHistoryMaxSize": 0,
        "disableMentions": "everyone",
        "ws": {
            "intents": [
                "GUILDS",
                "GUILD_VOICE_STATES",
                "GUILD_MESSAGES",
                "DIRECT_MESSAGES",
                "GUILD_MESSAGE_REACTIONS"
            ]
        }
    }

}