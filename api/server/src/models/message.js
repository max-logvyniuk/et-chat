import noop from 'lodash/noop';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    text: DataTypes.STRING,
    user: DataTypes.STRING
  }, {});
  Message.associate = noop; // models => {}
  // associations can be defined here
  return Message;
};
