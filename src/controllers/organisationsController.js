const { Op } = require("sequelize");
const User = require("../models/User");
const Organisation = require("../models/Organisation");
const UserOrganisation = require("../models/UserOrganisation");

const getAllOrganisations = async (req, res) => {
  try {
    const { userId } = req.user;

    const userOrganisations = await UserOrganisation.findAll({
      where: { userId },
    });

    const organisationIds = userOrganisations.map((uo) => uo.orgId);

    const organisations = await Organisation.findAll({
      where: {
        orgId: {
          [Op.in]: organisationIds,
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Organisations fetched successfully",
      data: {
        organisations: organisations.map((org) => ({
          orgId: org.orgId,
          name: org.name,
          description: org.description,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching organisations:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      statusCode: 500,
    });
  }
};

const getOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.user;

  try {
    // Check if the user belongs to the organisation
    const userOrganisation = await UserOrganisation.findOne({
      where: { userId, orgId },
    });

    if (!userOrganisation) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You do not have access to this organisation",
        statusCode: 403,
      });
    }
    
    const organisation = await Organisation.findOne({
      where: { orgId },
    });

    if (!organisation) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation fetched successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      statusCode: 500,
    });
  }
};

const createOrganisation = async (req, res) => {
  const { name, description } = req.body;

  try {
    const { userId } = req.user;

    const newOrganisation = await Organisation.create({
      name,
      description: description || "",
    });

    await UserOrganisation.create({
      userId,
      orgId: newOrganisation.orgId,
    });

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: newOrganisation.orgId,
        name: newOrganisation.name,
        description: newOrganisation.description,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      statusCode: 500,
    });
  }
};

const addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  const { userId: loggedInUserId } = req.user;

  try {
    // Check if the organisation exists
    const organisation = await Organisation.findOne({ where: { orgId } });
    if (!organisation) {
      return res.status(404).json({
        status: "Bad Request",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    // Check if the logged-in user belongs to the organisation
    const userOrg = await UserOrganisation.findOne({
      where: { userId: loggedInUserId, orgId },
    });
    if (!userOrg) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You do not have permission to add users to this organisation",
        statusCode: 403,
      });
    }

    // Check if the user to be added exists
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({
        status: "Bad Request",
        message: "User not found",
        statusCode: 404,
      });
    }

    // Check if the user is already a member of the organisation
    const userAlreadyInOrg = await UserOrganisation.findOne({
      where: { userId, orgId },
    });
    if (userAlreadyInOrg) {
      return res.status(400).json({
        status: "Bad Request",
        message: "User is already a member of this organisation",
        statusCode: 400,
      });
    }

    // Add the user to the organisation
    await UserOrganisation.create({ userId, orgId });

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      statusCode: 500,
    });
  }
};

module.exports = {
  getAllOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
};
