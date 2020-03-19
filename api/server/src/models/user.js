
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

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     // id: {
//     //   type: DataTypes.INTEGER,
//     //   primaryKey: true,
//     // },
//     fullname: DataTypes.STRING,
//     avatar: DataTypes.STRING
//   }, {});
//
//   const Message = sequelize.define('Message', {
//   //   id: {
//   //     type: DataTypes.INTEGER,
//   //     primaryKey: true,
//   //   },
//     text: DataTypes.STRING,
//     user: {
//       type: DataTypes.INTEGER,
//     },
//     attachments: DataTypes.STRING,
//   }, {});
//
//   User.hasMany(Message, { foreignKey: 'fullname', targetKey: 'user' });
//   // User.associate = noop;
//   return User;
// };
