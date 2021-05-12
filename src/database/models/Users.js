const { DataTypes, Model } = require("sequelize");

module.exports = class Users extends Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: DataTypes.STRING(18),
                primaryKey: true
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            xp: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            timestamps: false,
            sequelize
        });
    }
}