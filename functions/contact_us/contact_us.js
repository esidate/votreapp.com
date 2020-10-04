const { validator } = require("@exodus/schemasafe");
const faunadb = require("faunadb");
const chalk = require("chalk");
require("dotenv").config();

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

const resp = (success, message) =>
  JSON.stringify({
    success,
    message,
  });

const validate = validator(
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
); // Validate the POST data

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);

  if (validate(data)) {
    return client
      .query(q.Create(q.Collection("contact"), { data: data }))
      .then((response) => {
        console.log(chalk.green("Success"), response);
        return callback(null, {
          statusCode: 200,
          body: resp(true, "Your message has been submitted"),
        });
      })
      .catch((error) => {
        console.log(chalk.red("Failed"), error);
        return callback(null, {
          statusCode: 400,
          body: resp(false, "Something went wrong please try again later"),
        });
      });
  }

  console.log(chalk.red("Invalid JSON schema"), validate.errors);

  return callback(null, {
    statusCode: 200,
    body: resp(false, "Something went wrong please try again later"),
  });
};
