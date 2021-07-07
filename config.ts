import dotenv from "dotenv";

dotenv.config();

const ENV = process.env;

export default {
  port: parseInt(ENV.PORT),
};
