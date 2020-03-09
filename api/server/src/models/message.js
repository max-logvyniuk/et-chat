'use strict';
module.exports = (sequelize, DataType) => {
    const Message = sequelize.define('Message', {
        text: {
            type: DataType.STRING,
            allowNull: false,
        },
        user: {
            type: DataType.STRING
        }
    }, {});
    Message.associate = function (models) {

    };
    return Message
};