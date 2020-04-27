module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Messages',
      'read',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      }
    )
  },

  down: (queryInterface) => {
   return queryInterface.removeColumn(
     'Messages',
     'read')
  }
};
