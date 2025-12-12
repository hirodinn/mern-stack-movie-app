import express from "express";
import Joi from "joi";
import joi from "joi-objectid";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// exception for winston to handle it
/*
const p = Promise.reject(new Error("unhandled rejection"));
p.then(() => console.log("done"));
*/

//error for winston to catch it
/*
throw new Error('Unhandeled Error')
*/

Joi.objectId = joi(Joi);

app.listen(3000, () => console.log("Listening to port 3000..."));
