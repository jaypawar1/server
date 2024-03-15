const express = require("express");
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express().use(bodyParser.json());

app.listen(8000, () => {
    console.log("webhook is listening");
});

const token = "EAAIqSsKeP0QBOZCXPRe2U4DKxdIXEBnSKpT6D1kWdbCG63cYZASyo1WjbdPnoFO7dfNsv7muvfwdiaa6FwlrnHgI63jxcrJnqnFHK0rVxnZAe7uo2KmSwxl23GfBggCJi3rOrkdaYFDdwWyl76rCq1ZAT9Dwl5PXFfnM1rSyYX9MsEjDKaOqJMVavj1PxKO6Xt0SrBmDZAaTRuuesSWcZD";
const myToken = "sdhhijsfh";

app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];
    if (mode && challenge) {
        if (mode === "subscribe" && token === myToken) {
            console.log(challenge);
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

app.post("/webhook", (req, res) => {
    let bodyParam = req.body;

    console.log(JSON.stringify(bodyParam, null, 2));

    if (bodyParam.object === "page") {
        if (bodyParam.entry &&
            bodyParam.entry[0].changes &&
            bodyParam.entry[0].changes[0].value.message &&
            bodyParam.entry[0].changes[0].value.message[0]) {
            let phoneNumberId = bodyParam.entry[0].changes[0].value.metadata.phone_number_id;
            let from = bodyParam.entry[0].changes[0].value.message[0].from;
            let msgBody = bodyParam.entry[0].changes[0].value.message[0].text;
            axios({
                method: "POST",
                url: "https://graph.facebook.com/v13.0/" + phoneNumberId + "/message?access_token=" + token,
                data: {
                    messaging_type: "RESPONSE",
                    message: {
                        text: "Hi.. I'm Prasath"
                    }
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                console.log("Message sent successfully:", response.data);
            }).catch(error => {
                console.error("Error sending message:", error);
            });
        }
    }
    res.status(200).send("EVENT_RECEIVED");
});

