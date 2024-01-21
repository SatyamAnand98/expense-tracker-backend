const express = require("express");
const cors = require("cors");
const { db } = require("./db/db");
const { readdirSync } = require("fs");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

//routes
readdirSync("./routes").map((route) =>
    app.use("/api/v1", require("./routes/" + route))
);

const server = () => {
    // cron service to call "https://expense-tracker-7r6c.onrender.com" every 1 minute
    const cron = require("node-cron");
    cron.schedule("* * * * *", () => {
        const axios = require("axios");
        axios.get("https://expense-tracker-7r6c.onrender.com").catch((err) => {
            console.log("error in cron job");
        });
    });
    db();
    // GET request
    app.get("", (req, res) => {
        res.send("Hello World From Expense-tracker!");
    });
    app.listen(PORT, () => {
        console.log("listening to port:", PORT);
    });
};

server();
