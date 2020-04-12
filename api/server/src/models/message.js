module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    UploadFileId: DataTypes.STRING,
    text: DataTypes.STRING,
    imageAttachment: DataTypes.STRING,
  }, {});


  Message.associate = function(models) {
    Message.belongsTo(models.User, {foreignKey: 'UserId', as: 'userData'});
    Message.hasOne(models.UploadFile)
  };

  return Message;
};
