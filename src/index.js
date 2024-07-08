require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./utils/database");
const User = require("./models/User");
const Organisation = require("./models/Organisation");
const UserOrganisation = require("./models/UserOrganisation");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const organisationsRoutes = require("./routes/organisationsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

User.belongsToMany(Organisation, {
  through: UserOrganisation,
  foreignKey: "userId",
});
Organisation.belongsToMany(User, {
  through: UserOrganisation,
  foreignKey: "orgId",
});

// Sync database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database schema updated successfully");
  })
  .catch((error) => {
    console.error("Error updating database schema:", error);
  });

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

//  routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/organisations", organisationsRoutes);

if (require.main === module) {
  // If the script is being run directly, start the server
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await sequelize.sync();
  });
} else {
  // If the script is required as a module, export the app
  module.exports = app;
}
