module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Messages',
      'read',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }
    )
  },

  down: (queryInterface) => {
   return queryInterface.removeColumn(
     'Messages',
     'read')
  }
};
