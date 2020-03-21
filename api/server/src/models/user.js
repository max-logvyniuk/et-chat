module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullname: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {});

  User.associate = function (models) {
    User.hasMany(models.Message, {as: 'userMessages'})
  };
  return User;
};
