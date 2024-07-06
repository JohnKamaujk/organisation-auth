const { Op } = require("sequelize");
const Organisation = require("../models/organisation");
const UserOrganisation = require("../models/userOrganisation");

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

module.exports = {
  getAllOrganisations,
};
