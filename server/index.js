const express = require("express");
const cors = require("cors");
const { StreamChat } = require('stream-chat');
const localtunnel = require('localtunnel');

const authRoutes = require("./routes/auth.js");

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

const chatClient = new StreamChat(api_key, api_secret);

const app = express();
const PORT = process.env.PORT || 8000;

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/auth", authRoutes);

app.post("/", (req, res) => {
    const { message, form_data } = req.body;
    const isAppointment = message.command === "appointment";

    if (isAppointment && !form_data) {
        message.text = "";
        message.type = "ephemeral";
        message.mml = `
            <mml type="card">
                <input name="phone" label="Please Enter your phone number" placeholder="e.g. 999-999-9999"></input>
                <button name="action" value="submit">Submit</button>
            </mml>
        `;
    }
    else if (isAppointment && form_data && form_data.phone) {
        const buttonText = `Book ${message.args}`.trim();
        message.phone = form_data.phone; // store temporary data in the message object
        message.mml = `
            <mml type="card">
            <text>Please choose a time slot:</text>
            <scheduler name="appointment" duration="30" interval="30" selected="2021-03-15T10:30:00.000Z" />
            <button name="action" value="reserve" icon="add_alarm">${buttonText}</button>
            </mml>
    `;
    }
    else if (
        isAppointment &&
        form_data &&
        form_data.action === "reserve" &&
        form_data.appointment
    ) {
        message.type = "regular";
        message.phone = undefined;
        const title = `Appointment ${message.args}`.trim();
        const end = new Date(
            Date.parse(form_data.appointment) + 30 * 60000
        ).toISOString();
        message.mml = `
            <mml>
                <add_to_calendar
                title="${title}"
                start="${form_data.appointment}"
                end="${end}"
                description="Your appointment with stream"
                location="Stream, Amsterdam"
                />
            </mml>
        `;
    } else {
        message.type = "error";
        message.text = "invalid command or input";
    }

    return res.status(200).json({ ...req.body, message });
});
const setupTunnelAndWebhook = async () => {
    const { url } = await localtunnel({ port: PORT });
    const cmds = await chatClient.listCommands();
    if (!cmds.commands.find(({ name }) => name === 'appointment')) {
        await chatClient.createCommand({
            name: 'appointment',
            description: 'Create an appointment',
            args: '[description]',
            set: 'mml_commands_set',
        });
    }
    const type = await chatClient.getChannelType('messaging');
    if (!type.commands.find(({ name }) => name === 'appointment')) {
        await chatClient.updateChannelType('messaging', { commands: ['all', 'appointment'] });
    }
    await chatClient.updateAppSettings({ custom_action_handler_url: url });
};

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running in http://127.0.0.1:${PORT}`);

    setupTunnelAndWebhook();
});
