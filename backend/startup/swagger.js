import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CineVault API Documentation",
      version: "1.0.0",
      description: "API documentation for the Movie Rental application",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "https://mern-stack-movie-app-1.onrender.com",
        description: "Production server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default function (app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
