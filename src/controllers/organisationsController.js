const { Op } = require("sequelize");
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

  try {
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

module.exports = {
  getAllOrganisations,
  getOrganisation,
  createOrganisation,
};
