const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const UserOrganisation = sequelize.define("UserOrganisation", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "userId",
    },
    onDelete: "CASCADE",
  },
  orgId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Organisations",
      key: "orgId",
    },
    onDelete: "CASCADE",
  },
});

module.exports = UserOrganisation;
