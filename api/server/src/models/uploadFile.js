module.exports = (sequelize, DataTypes) => {
  const UploadFile = sequelize.define('UploadFile', {
    filename: DataTypes.STRING,
    size: DataTypes.STRING,
    ext: DataTypes.STRING,
    url: DataTypes.STRING,
    MessageId: DataTypes.STRING
  }, {});


  UploadFile.associate = function(models) {
    UploadFile.belongsTo(models.Message);
    UploadFile.belongsTo(models.User, {foreignKey: 'UserId', as: 'userAttachmentData'})
  };

  return UploadFile;
};
