import dotenv from "dotenv";
dotenv.config();

const config = {
    PORT: process.env.PORT || "3001",
    DB_NAME : process.env.DB_NAME || "configure on config.ts",
    DB_USER : process.env.DB_USER || "configure on config.ts",
    JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN,
    JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
};


export default config;