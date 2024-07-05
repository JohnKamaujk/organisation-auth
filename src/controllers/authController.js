const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organisation = require("../models/Organisation");
const UserOrganisation = require("../models/UserOrganisation");

const JWT_SECRET = process.env.JWT_SECRET ;

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    // Create default organisation
    const organisationName = `${firstName}'s Organisation`;
    const organisation = await Organisation.create({
      name: organisationName,
    });

    // Link user and organisation
    await UserOrganisation.create({
      userId: user.userId,
      orgId: organisation.orgId,
    });

    // Create JWT token
    const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return success response
    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

module.exports = {
  registerUser,
};
