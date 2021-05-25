require("dotenv").config();
const configuration = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};
const app = require("express")();
const line = require("@line/bot-sdk");
const client = new line.Client(configuration);

app.get("/", function (req, res) {
  res.status(200).send("Hello");
});

app.post("/event", line.middleware(configuration), function (req, res) {
  req.body.events.map((event) => {
    client.replyMessage(
      event.replyToken,
      { type: "text", text: "Hello!" },
      false
    );
  });
  res.status(200).send("Hello");
});

app.listen(process.env.PORT);
