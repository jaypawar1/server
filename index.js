const express = require("express");
const body_parser = require('body-parser');

const app = express().use(body_parser.json());

app.listen(8000, () => {
    console.log("webhook is listning");
})
const token = "EAAIqSsKeP0QBOZCXPRe2U4DKxdIXEBnSKpT6D1kWdbCG63cYZASyo1WjbdPnoFO7dfNsv7muvfwdiaa6FwlrnHgI63jxcrJnqnFHK0rVxnZAe7uo2KmSwxl23GfBggCJi3rOrkdaYFDdwWyl76rCq1ZAT9Dwl5PXFfnM1rSyYX9MsEjDKaOqJMVavj1PxKO6Xt0SrBmDZAaTRuuesSWcZD";
const mytoken = "sdhhijsfh"
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let chalange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];
    if (mode && chalange) {
        if (mode === "subscribe" && token === mytoken) {
            console.log(chalange);
            res.status(200).send(chalange);
        } else {
            res.sendStatus(403);
        }
    }
})

app.post("/webhook", (req, res) => {
    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2));

    if (body_param.object) {
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.message &&
            body_param.entry[0].changes[0].value.message[0]) {
            let phone_no_id = body_param.entry[0].challange[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
            axios({
                method: "POST",
                url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/message?access_token=" + token,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: "Hi.. I'm Prasath"
                    }
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
    }
})