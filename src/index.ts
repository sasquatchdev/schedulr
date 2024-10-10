import { getConfig, getDotenvConfig, getPathToEnvironment } from "./config.js"
import * as dotenv from "dotenv"
import * as path from "path"
import { getCourse, getPeriods, getSchoolyear, getWebUntisSimple } from "./untis.js";
import { WebUntisElementType } from "webuntis";

getDotenvConfig();

const config = await getConfig();
const { school, base } = config.untis;

const untis = await getWebUntisSimple(school, base);
const year = await getSchoolyear(untis, config.untis.year);
const course = await getCourse(untis, year, config.untis.course);

const range = 14;
const start = new Date();
const end = new Date(start);
end.setDate(end.getDate() + range);

const periods = await getPeriods(untis, course, start, end);
console.log(periods.length + " periods in the next " + range + " days.")