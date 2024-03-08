// require("dotenv").config();

// const express = require("express");
// const bodyParser = require("body-parser");
// const request = require("request");
// const https = require("https");
// const { send } = require("process");
// const path = require('path');

// const app = express();
// const port = 3000;

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// app.listen(process.env.PORT || port, () => {
//   console.log(`Server is running on ${port}`);
// });

// app.get("*", (req, res) => {
//   res.sendFile(__dirname + "index.html");
// });

// app.post("/", (req, res) => {
//   const apiKey = process.env.API_KEY;
//   const audienceId = process.env.MAILCHIMP_LIST_ID;
//   const firstName = req.body.firstname;
//   const lastName = req.body.lastname;
//   const email = req.body.email;

//   const data = {
//     members: [
//       {
//         email_address: email,
//         status: "subscribed",
//         merge_fields: {
//           FNAME: firstName,
//           LNAME: lastName,
//         },
//       },
//     ],
//   };

//   const jsonData = JSON.stringify(data);

//   const url = `https://us18.api.mailchimp.com/3.0/lists/${audienceId}`;

//   const options = {
//     method: "POST",
//     auth: `bolu1:${apiKey}`,
//   };

//   const request = https.request(url, options, (response) => {
//     try {
//       response.on("data", (data) => {
//         if (response.statusCode === 200) {
//           res.sendFile(__dirname + "/success.html");
//         } else {
//           res.sendFile(__dirname + "/error.html");
//         }
//       });
//     } catch (error) {
//       response.on("error", (error) => {
//         console.error(error, response.statusCode);
//         res.sendFile(__dirname + "/error.html");
//       });
//     }
//   });

//   request.write(jsonData);
//   request.end();
// });

// app.post("/error", (req, res) => {
//   res.redirect("/");
// });

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files from the root directory and the public directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname)); // Serve static files from the root directory

app.use(bodyParser.urlencoded({ extended: true }));

// app.listen(process.env.PORT || port, () => {
//   console.log(`Server is running on ${port}`);
// });

// Fallback route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/", (req, res) => {
  const apiKey = process.env.API_KEY;
  const audienceId = process.env.MAILCHIMP_LIST_ID;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = `https://us18.api.mailchimp.com/3.0/lists/${audienceId}`;
  const options = {
    method: "POST",
    auth: `bolu1:${apiKey}`,
  };

  const mailchimpRequest = https.request(url, options, (response) => {
    try {
      response.on("data", (data) => {
        if (response.statusCode === 200) {
          res.sendFile(path.join(__dirname, "success.html"));
        } else {
          res.sendFile(path.join(__dirname, "error.html"));
        }
      });
    } catch (error) {
      response.on("error", (error) => {
        console.error(error, response.statusCode);
        res.sendFile(path.join(__dirname, "error.html"));
      });
    }
  });

  mailchimpRequest.write(jsonData);
  mailchimpRequest.end();
});

app.post("/error", (req, res) => {
  res.redirect("/");
});
