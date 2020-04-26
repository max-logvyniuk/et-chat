module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Messages',
      'read',
      {
        type: Sequelize.BOOL,
        allowNull: false,
      }
    )
  },

  down: (queryInterface) => {
   return queryInterface.removeColumn(
     'Messages',
     'read')
  }
};
