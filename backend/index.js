import express from "express";
import startDb from "./startup/db.js";
import startConfig from "./startup/config.js";
import startRoute from "./startup/routes.js";

const app = express();

startDb();
startConfig();
startRoute(app);

app.listen(3000, () => console.log("Listening to port 3000..."));
