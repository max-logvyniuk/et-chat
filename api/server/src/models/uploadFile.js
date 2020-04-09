module.exports = (sequelize, DataTypes) => {
  const UploadFile = sequelize.define('UploadFile', {
    ext: DataTypes.STRING,
    filename: DataTypes.STRING,
    MessageId: DataTypes.STRING,
    publicId: DataTypes.STRING,
    size: DataTypes.STRING,
    url: DataTypes.STRING,
    UserId: DataTypes.STRING

  }, {});


  UploadFile.associate = function(models) {
    UploadFile.belongsTo(models.Message);
    UploadFile.belongsTo(models.User, {foreignKey: 'UserId', as: 'userAttachmentData'})
  };

  return UploadFile;
};
