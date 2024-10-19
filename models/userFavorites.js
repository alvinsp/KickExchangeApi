'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserFavorites = sequelize.define('UserFavorites', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        }
    }, {
        timestamps: false
    });

    UserFavorites.associate = function (models) {
        UserFavorites.belongsTo(models.Users, { foreignKey: 'userId' });
        UserFavorites.belongsTo(models.Products, { foreignKey: 'productId' });
    };

    return UserFavorites;
};
