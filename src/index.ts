import { getConfig, getDotenvConfig, getPathToEnvironment } from "./config.js"
import * as dotenv from "dotenv"
import * as path from "path"
import { getCourse, getSchoolyear, getWebUntisSimple } from "./untis.js";

getDotenvConfig();

const config = await getConfig();
const { school, base } = config.untis;

const untis = await getWebUntisSimple(school, base);
const year = await getSchoolyear(untis, config.untis.year);
const course = await getCourse(untis, year, config.untis.course);

console.log("Course: '" + course.longName + "'")