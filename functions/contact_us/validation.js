const { validator } = require("@exodus/schemasafe");

/* Validates the contact-us form data */

module.exports = validator(
  {
    type: "object",
    required: [
      "fname",
      "lname",
      "email",
      "message",
      "date",
      "ip",
      "loc",
      "uag",
    ],
    properties: {
      fname: {
        type: "string",
      },
      lname: {
        type: "string",
      },
      email: {
        type: "string",
      },
      message: {
        type: "string",
      },
      date: {
        type: "string",
      },
      ip: {
        type: "string",
      },
      loc: {
        type: "string",
      },
      uag: {
        type: "string",
      },
    },
  },
  { includeErrors: true, allErrors: true }
);
