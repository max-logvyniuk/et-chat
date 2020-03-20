module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // Message belongsTo User 1:1
          model: 'Users',
          key: 'id'
        }
      },
      UserId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attachments: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Messages');
  }
};
