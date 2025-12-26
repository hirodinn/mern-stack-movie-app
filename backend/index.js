import express from "express";
import startDb from "./startup/db.js";
import startConfig from "./startup/config.js";
import startRoute from "./startup/routes.js";

import logger from "./logger.js";

const app = express();

startConfig();
startDb();
startRoute(app);

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening to port ${port}...`));
