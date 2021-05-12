const { DataTypes, Model } = require("sequelize");

module.exports = class GuildConfigs extends Model {
    static init(sequelize) {
        return super.init({
            guildId: {
                type: DataTypes.STRING(18),
                primaryKey: true
            },
            prefix: {
                type: DataTypes.STRING(10),
                allowNull: false
            }
        }, {
            timestamps: false,
            sequelize
        });
    }
}