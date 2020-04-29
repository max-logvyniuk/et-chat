module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    fullname: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {});

  User.associate = function createUserAssociation(models) {
    User.hasMany(models.Message, {as: 'userMessages'});
    User.hasMany(models.UploadFile, {as: 'userUploadFiles'})
  };
  return User;
};
