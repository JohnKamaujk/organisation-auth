const request = require("supertest");
const app = require("../index");
const { User } = require("../models/User");
const { UserOrganisation } = require("../models/UserOrganisation");
const { Organisation } = require("../models/Organisation");

describe("POST /auth/register", () => {
  beforeEach(async () => {
    if (process.env.NODE_ENV === "test") {
      await User.destroy({ where: {}, truncate: true });
      await Organisation.destroy({ where: {}, truncate: true });
    }
  });

  it("should register user successfully with default organisation", async () => {
    const response = await request(app).post("/api/auth/register").send({
      firstName: "Lionel",
      lastName: "Messi",
      email: "lionel@example.com",
      password: "lionel123",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.firstName).toBe("Lionel");
    expect(response.body.data.user.lastName).toBe("Messi");
    expect(response.body.data.user.email).toBe("lionel@example.com");
    expect(response.body.data.accessToken).toBeDefined();

    const user = await User.findOne({
      where: { email: "lionel@example.com" },
    });
    const organisation = await Organisation.findOne({
      where: { name: "Lionel's Organisation" },
    });

    expect(user).toBeDefined();
    expect(organisation).toBeDefined();
  });

  it("should log the user in successfully", async () => {
    await request(app).post("/api/auth/register").send({
      firstName: "Jerry",
      lastName: "Miles",
      email: "jerry@example.com",
      password: "jerry123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "jerry@example.com",
      password: "jerry123",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe("jerry@example.com");
    expect(response.body.data.accessToken).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const userData = {
      lastName: "Brown",
      email: "mike@example.com",
      password: "mike123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.status).toBe(422);
  });

  it("should fail if there’s duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      firstName: "Pance",
      lastName: "White",
      email: "pance@example.com",
      password: "pance123",
    });

    const response = await request(app).post("/api/auth/register").send({
      firstName: "Violet",
      lastName: "Sivar",
      email: "pance@example.com",
      password: "violet123",
    });

    expect(response.status).toBe(400);
  });
});
