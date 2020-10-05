const sendMail = require("../modules/mail"); // MailJet mailer function
const validate = require("./validation"); // JSON schema validator

const json2html = require("node-json2html");
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

const template = {
  "<>": "ul",
  html: [
    { "<>": "li", html: "First name: ${fname}" },
    { "<>": "li", html: "Last name: ${lname}" },
    { "<>": "li", html: "Email: ${email}" },
    { "<>": "li", html: "Phone: ${phone}" },
    { "<>": "li", html: "Message: ${message}" },
    { "<>": "li", html: "Date: ${date}" },
    { "<>": "li", html: "Browser/OS: ${uag}" },
    { "<>": "li", html: "Location: ${loc}" },
    { "<>": "li", html: "IP: ${ip}" },
  ],
};

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);

  console.log(json2html.transform(data, template));

  return;
  if (validate(data)) {
    return client
      .query(q.Create(q.Collection("contact"), { data: data })) // Save form data to FaunaDB
      .then((response) => {
        console.log(
          chalk.keyword("purple")("[FaunaDB]"),
          chalk.green(" Success :"),
          response
        );
        return sendMail(
          process.env.FROM_EMAIL,
          process.env.TO_EMAIL,
          "[VotreApp] You have a new contact-us message.",
          json2html.transform(data, template),
          process.env.MJ_APIKEY_PUBLIC,
          process.env.MJ_APIKEY_PRIVATE
        ) // Notify me through email
          .then((result) => {
            console.log(
              chalk.keyword("orange")("[MailJet]"),
              chalk.green(" Success : "),
              result
            );
            return callback(null, {
              statusCode: 200,
              body: resp(true, "Your message has been submitted"),
            });
          })
          .catch((err) => {
            console.log(
              chalk.keyword("orange")("[MailJet]"),
              chalk.red(" Error : "),
              err
            ); // Console log the error
            return callback(null, {
              statusCode: 200,
              body: resp(true, "Your message has been submitted"),
            }); // This is related to the form data being submitted to FaunaDB
          });
      })
      .catch((error) => {
        console.log(
          chalk.keyword("purple")("[FaunaDB]"),
          chalk.red(" Error : "),
          error
        );
        return callback(null, {
          statusCode: 400,
          body: resp(false, "Something went wrong please try again later"),
        }); // This is related to the failure to submit form data to FaunaDB
      });
  }

  console.log(
    chalk.keyword("purple")("[FaunaDB]"),
    chalk.red(" JSON Error : "),
    validate.errors
  );

  return callback(null, {
    statusCode: 200,
    body: resp(false, "Something went wrong please try again later"),
  });
};
