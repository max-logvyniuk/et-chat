module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    text: DataTypes.STRING,
    attachments: DataTypes.STRING
  }, {});

  // const User = sequelize.define('User', {
  //   fullname: DataTypes.STRING,
  //   avatar: DataTypes.STRING
  // }, {});

  Message.associate = function(models) {
    Message.belongsTo(models.User, {foreignKey: 'UserId', as: 'userData'})
  };

  // Message.addScope('withUser', {
  //   include: [
  //     {
  //       model: User,
  //       required: false,
  //       as: 'userData',
  //       where: {
  //         related_model: 'Messages',
  //       },
  //     },
  //   ],
  // });
  return Message;
};
