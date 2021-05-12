const BaseCommand = require("../../utils/structures/BaseCommand");

class HelpCommand extends BaseCommand {
    constructor() {
        super({
            name: "help",
            description: "Get help on how to use the bot and it's commands",
            args: "[command]",
            examples: ["help", "help ping"],
            cooldown: 3000,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        });

        this.commands = this.client.commandLoader.commands;
        this.commandAliases = this.client.commandLoader.commandAliases
        this.categories = this.client.commandLoader.categories;
    }

    /**
     * Run the command
     * @param {import("discord.js").Message} msg - The message
     */
    run(msg) {
        // Show all commands
        if (!msg.args[0]) {
            const helpEmbed = this.global.embed()
                .setTitle("Help embed")
                .setDescription(`The current prefix is \`${msg.prefix}\`\nFor more information use \`${msg.prefix}help <command>\`\nPlease report bugs when found`);
            for (const categorie in this.categories) {
                let commands = [];
                this.categories[categorie].forEach(command => commands.push(`\`${command}\``));
                commands = commands.join(" ");
                helpEmbed.addField(categorie, commands, false);
            }
            this.sender.send(msg, helpEmbed);
        }

        // Show 1 specific command
        else if (this.commands[msg.args[0].toLowerCase()] || this.commandAliases[msg.args[0].toLowerCase()]) {
            let command = this.commands[msg.args[0].toLowerCase()];
            if (!command) command = this.commands[this.commandAliases[msg.args[0].toLowerCase()]];
            const helpEmbed = this.global.embed()
                .setTitle(`\`${msg.prefix}${command.name} ${command.args}\``)
                .setFooter("<> = required [] = optional")
                .setDescription(command.description)
                .addField("Cooldown", `${Math.round(command.cooldown / 1000)}s`, true)
                .addField("Is nsfw?", (command.nsfw) ? "Yes" : "No", true)
                .addField("Works in dm?", (command.disableDm) ? "No" : "Yes", true);

            if (command.permissions.length > 0) {
                let permissions = [];
                command.permissions.forEach(permission => permissions.push(`\`${permission}\``));
                permissions = permissions.join("\n");
                helpEmbed.addField("Permissions needed", permissions, true);
            }

            if (command.aliases.length > 0) {
                let aliases = [];
                command.aliases.forEach(alias => aliases.push(`\`${msg.prefix}${alias}\``));
                aliases = aliases.join("\n");
                helpEmbed.addField("Aliases", aliases, true);
            }

            if (command.examples.length > 0) {
                let examples = [];
                command.examples.forEach(example => examples.push(`\`${msg.prefix}${example}\``));
                examples = examples.join("\n");
                helpEmbed.addField("Example usage", examples, true);
            }

            this.sender.send(msg, helpEmbed);
        }

        // Invalid argument
        else {
            this.sender.invalid(msg, "Thats not a command, please provide a valid command", 5000);
        }
    }
}

module.exports = HelpCommand;