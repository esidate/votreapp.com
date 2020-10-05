module.exports = (from, to, subject, html, publicKey, privateKey) => {
  const mailjet = require("node-mailjet").connect(publicKey, privateKey);
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: from,
          Name: from.match(/([^@]+)/)[1],
        },
        To: [
          {
            Email: to,
            Name: to.match(/([^@]+)/)[1],
          },
        ],
        Subject: subject,
        HTMLPart: html,
      },
    ],
  });
};
