"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("refreshTokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      token: {
        type: Sequelize.STRING,
      },
      expires: {
        type: Sequelize.STRING,
      },
      revokedByIp: {
        type: Sequelize.STRING,
      },
      revoked: {
        type: Sequelize.DATE,
      },
      replacedByIp: {
        type: Sequelize.STRING,
      },
      isExpired: {
        type: Sequelize.BOOLEAN,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      createdByIp: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("refreshTokens");
  },
};
