import express from "express";
import startDb from "./startup/db.js";
import startConfig from "./startup/config.js";
import startRoute from "./startup/routes.js";

const app = express();

startDb();
startConfig();
startRoute(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));
