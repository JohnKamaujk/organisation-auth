const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const User = require("./User");

const Organisation = sequelize.define("Organisation", {
  orgId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});

Organisation.belongsToMany(User, {
  through: "UserOrganisation",
  foreignKey: "orgId",
});

module.exports = Organisation;
