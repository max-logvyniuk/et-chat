// import noop from 'lodash/noop';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    text: DataTypes.STRING,
    user: DataTypes.INTEGER,
    attachments: DataTypes.STRING
  }, {});

  const User = sequelize.define('User', {
    fullname: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {});

  Message.associate = function(models) {
    Message.belongsTo(models.User, {foreignKey: 'user', as: 'userData'})
  };
  // Message.addScope('defaultScope', {
  //   include: { model: User, where: { id: Message.user } },
  // });

  Message.addScope('withUser', {
    include: [
      {
        model: User,
        required: false,
        as: 'userData',
        where: {
          related_model: 'Messages',
        },
      },
    ],
  });
  return Message;
};

// import noop from 'lodash/noop';
// import { Sequelize } from "sequelize";
// import User from './user';
// module.exports = (sequelize, DataTypes) => {
//   const Message = sequelize.define('Message', {
//     // id: {
//     //   type: DataTypes.INTEGER,
//     //   primaryKey: true,
//     // },
//     text: DataTypes.STRING,
//     user: {
//       type: DataTypes.INTEGER,
//     },
//     attachments: DataTypes.STRING,
//   }, {});
//   const User = sequelize.define('User', {
//   //   id: {
//   //     type: DataTypes.INTEGER,
//   //     primaryKey: true,
//   //   },
//     fullname: DataTypes.STRING,
//     avatar: DataTypes.STRING
//   }, {});
//
//   Message.belongsTo(User, {foreignKey: 'user', targetKey: 'fullname'});
//
//   // Message.associate = noop;
//
//   return Message;
// };
