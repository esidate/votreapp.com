const faunadb = require("faunadb");
const chalk = require("chalk");
require('dotenv').config()

const q = faunadb.query;
secret = 'fnAD23tFhOACBTJ3dnbSpv-98i7atXVN6-gduAdq';
const client = new faunadb.Client({
  secret,
});

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("Contact.js is invoked", data);
  const form = {
    data: data,
  };

  return client
    .query(q.Create(q.Ref("classes/contact"), form))
    .then((response) => {
      console.log("Success", response);
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
      });
    })
    .catch((error) => {
      console.log("Failed", error);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error),
      });
    });
};
