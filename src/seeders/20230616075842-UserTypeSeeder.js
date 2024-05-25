'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return await queryInterface.bulkInsert('userTypes', [{
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: 'Coach',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: 'Client',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userTypes', null, {});
  }
};
