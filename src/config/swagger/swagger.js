const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "spoonApplication",
        description: "Description",
    },
    host: "localhost:3000",
    basePath: "",
    schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
    "../../index.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);