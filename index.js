const client = require("./src/Bot");
const auth = require("./secret/auth");

// Fix console being unreadable on pterodactyl
console.log("\n");

// Authorise the bot
client.logger.info("Connecting to discord...");
client.login(auth.token);