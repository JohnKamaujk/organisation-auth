const User = require("../models/User");
const UserOrganisation = require("../models/UserOrganisation");

const getUserRecord = async (req, res) => {
  const { id } = req.params; // User Id from request params
  const { userId } = req.user; // Extracted user Id from authenticated user

  try {
    // Check if the requesting user is trying to access their own record
    if (userId === id) {
      const user = await User.findOne({ where: { userId: id } });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
          statusCode: 404,
        });
      }
      return res.status(200).json({
        status: "success",
        message: "User record retrieved successfully",
        data: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
        },
      });
    }

    // Retrieve organizations the logged-in user belongs to
    const loggedInUserOrgs = await UserOrganisation.findAll({
      where: { userId: userId },
      attributes: ["orgId"],
    });
    const loggedInUserOrgIds = loggedInUserOrgs.map((org) => org.orgId);

    // Retrieve organizations the target user belongs to
    const targetUserOrgs = await UserOrganisation.findAll({
      where: { userId: id },
      attributes: ["orgId"],
    });
    const targetUserOrgIds = targetUserOrgs.map((org) => org.orgId);

    // Check if there is any common organization between logged-in user and target user
    const hasAccess = loggedInUserOrgIds.some((orgId) =>
      targetUserOrgIds.includes(orgId)
    );

    if (!hasAccess) {
      return res.status(403).json({
        status: "error",
        message: "Access denied",
        statusCode: 403,
      });
    }

    // If access is allowed, retrieve the target user's record
    const user = await User.findOne({ where: { userId: id } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        statusCode: 404,
      });
    }

    return res.json({
      status: "success",
      message: "User record retrieved successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      statusCode: 500,
    });
  }
};

module.exports = {
  getUserRecord,
};
