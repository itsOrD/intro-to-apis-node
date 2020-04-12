require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const TwilioClient = require('twilio');
const app = express();
const port = 3000;

const client = new TwilioClient()
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// This is a single page application and it's all rendered in public/index.html
app.use(express.static("public"));
// Parse the body of requests automatically
app.use(bodyParser.json());

app.get("/api/compliments", async (req, res) => {
  const sentMessages = await client.messages.list({ from: twilioPhoneNumber })
  // TODO: Gather only the body of those messages for sending to the client
  const compliments = sentMessages.forEach(msg => msg.body)
  res.json(compliments);
});

app.post("/api/compliments", async (req, res) => {
  const to = req.body.to;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const body = `${req.body.sender} says: ${req.body.receiver} is ${req.body.compliment}. See more compliments at ${req.headers.referer}`;
  client.messages
    .create({
      from: from,
      body: body,
      to: to
    })
  res.json({ success: false });
});

app.listen(port, () => console.log(`Prototype is listening on port ${port}!`));
