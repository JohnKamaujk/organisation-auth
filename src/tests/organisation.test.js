require("dotenv").config();
const { User } = require("../models/User"); 
const { UserOrganisation } = require("../models/UserOrganisation"); 
const { Organisation} = require("../models/Organisation"); 
const app = require("../index");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Organisation Access Control", () => {
  let token;
  let userId;
  let orgId;

  beforeAll(async () => {
    const user = await User.create({
      firstName: "Jack",
      lastName: "Knight",
      email: "jack@gmail.com",
      password: "pass1234",
      phone: "1234567890",
    });

    const organisation = await Organisation.create({
      name: "Test Organisation",
      description: "A test organisation",
    });

    await UserOrganisation.create({
      userId: user.userId,
      orgId: organisation.orgId,
    });

    token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);
    userId = user.userId;
    orgId = organisation.orgId;
  });

  it("should allow access to an organization the user belongs to", async () => {
    const response = await request(app)
      .get(`/api/organisations/${orgId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.orgId).toBe(orgId);
  });

  it("should not allow access to an organization the user does not belong to", async () => {
    const anotherOrg = await Organisation.create({
      name: "Another Organisation",
      description: "Another test organisation",
    });

    const response = await request(app)
      .get(`/api/organisations/${anotherOrg.orgId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403); // Assuming 403 Forbidden for unauthorized access
  });
});
