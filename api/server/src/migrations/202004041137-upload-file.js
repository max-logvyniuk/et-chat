module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UploadFiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ext: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      MessageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      size: {
        type: Sequelize.STRING
      },
      publicId: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    return queryInterface.dropTable('UploadFiles');
  }
};
