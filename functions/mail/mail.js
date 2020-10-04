const sendMail = require("sendmail")();

exports.handler = (event, context, callback) => {
  if (!process.env.CONTACT_EMAIL) {
    return callback(null, {
      statusCode: 500,
      body: "process.env.CONTACT_EMAIL must be defined",
    });
  }

  const body = JSON.parse(event.body);

  // validateLength("body.name", body.name, 3, 50);

  // validateEmail("body.email", body.email);

  // validateLength("body.details", body.details, 10, 1000);

  const descriptor = {
    from: `"${body.email}" <no-reply@votreapp.com>`,
    to: process.env.CONTACT_EMAIL,
    subject: `${body.name} sent you a message from votreapp.com`,
    text: body.details,
  };

  sendMail(descriptor, (e) => {
    if (e) {
      callback(null, {
        statusCode: 500,
        body: e.message,
      });
    } else {
      callback(null, {
        statusCode: 200,
        body: "",
      });
    }
  });
};
