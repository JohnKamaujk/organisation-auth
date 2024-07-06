const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return res.status(422).json({ errors: formattedErrors });
  }

  next();
};

const registrationValidationRules = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
const organisationValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required and cannot be null")
    .isLength({ min: 2 })
    .withMessage("organisation name must be at least 2 characters long"),
];

const validateRegistration = [
  ...registrationValidationRules,
  handleValidationErrors,
];

const validateOrganisation = [
  ...organisationValidationRules,
  handleValidationErrors,
];

module.exports = {
  validateRegistration,
  validateOrganisation
};
