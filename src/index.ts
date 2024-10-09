import { getConfig, getDotenvConfig, getPathToEnvironment } from "./config.js"
import * as dotenv from "dotenv"
import * as path from "path"

getDotenvConfig();

const config = await getConfig();
console.log("Logging: " + config.debug.level)