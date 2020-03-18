// import noop from 'lodash/noop';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    // },
    fullname: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {});

  const Message = sequelize.define('Message', {
  //   id: {
  //     type: DataTypes.INTEGER,
  //     primaryKey: true,
  //   },
    text: DataTypes.STRING,
    user: {
      type: DataTypes.INTEGER,
    },
    attachments: DataTypes.STRING,
  }, {});

  User.hasMany(Message, { foreignKey: 'fullname', targetKey: 'user' });
  // User.associate = noop;
  return User;
};
