require("dotenv").config();

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

describe("Token Generation", () => {
  it("should generate a token with the correct userId", () => {
    const userId = "test-user-id";
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

    const decodedToken = jwt.verify(token, JWT_SECRET);
    expect(decodedToken.userId).toBe(userId);
  });
  
  it("should expire the token after the specified time", (done) => {
    const userId = "test-user-id";
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1s" });

    setTimeout(() => {
      try {
        jwt.verify(token, JWT_SECRET);
      } catch (e) {
        expect(e.name).toBe("TokenExpiredError");
        done();
      }
    }, 2000); // wait for 2 seconds to ensure token expires
  });
});
