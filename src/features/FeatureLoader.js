const BaseFeature = require("../utils/structures/BaseFeature");
const fs = require("fs").promises;
const path = require("path");

/**
 * FeatureLoader
 * The class for loading and unloading features
 */
class CommandLoader {
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
        this.config = client.config;

        /**
         * All the currenty loaded features
         */
        this.features = {};
        this.categories = {};

        /**
         * The path to the features folder
         */
        this.path = "./src/features/"
    }

    /**
     * Load all the features that are available
     */
    async loadAll() {
        // Get all the categories
        const categories = await fs.readdir(this.path);
        for (const category of categories) {
            // Load the features if it's a folder
            if ((await fs.lstat(this.path + category)).isDirectory()) {
                this.categories[category] = [];
                const files = await fs.readdir(this.path + category);
                // Go through all the feature files
                for (const file of files) {
                    if (file.endsWith(".js")) {
                        const Feature = require(path.join(__dirname, `${category}/${file}`));
                        if (Feature.prototype instanceof BaseFeature) {
                            const feature = new Feature();
                            this.features[feature.name] = feature;
                            this.categories[category].push(feature.name);
                        }
                    }
                }
            }
            // If the category has no events remove it
            if (this.categories[category] == {}) {
                delete this.categories[category];
            }
        }
    }

    /**
     * Start all the loaded features
     */
    async startAll() {
        for (const feature in this.features) {
            try {
                this.features[feature].start();
            } catch (err) {
                this.logger.error(err);
            }
        }
    }
}

module.exports = CommandLoader;

/**
 * @typedef {import("../Bot")} Client
 */