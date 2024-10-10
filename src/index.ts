import { ENV_PATH, getConfig, getDotenvConfig, getPathToEnvironment } from "./config.js"
import * as dotenv from "dotenv"
import * as path from "path"
import * as fs from "fs"
import { getCourse, getPeriods, getSchoolyear, getWebUntisSimple } from "./untis.js";
import { WebUntisElementType } from "webuntis";
import { addPeriodEvent, getGoogleCalendar } from "./google.js";

/* Load Config & Environment */

console.debug("Loading environment...");
getDotenvConfig();

console.debug("Loading config...");
const config = await getConfig();
const { school, base } = config.untis;

/* Load Untis */
console.debug("Authenticating Untis...");
const untis = await getWebUntisSimple(school, base);

console.debug("Loading Schoolyear...");
const year = await getSchoolyear(untis, config.untis.year);

console.debug("Loading Course...");
const course = await getCourse(untis, year, config.untis.course);

/* Laad Periods */

console.debug("Getting Date Range...");
const range = config.time.range;
const start = new Date();
const end = new Date(start);
end.setDate(end.getDate() + range);

console.debug("Getting Periods...");
const periods = await getPeriods(untis, config, course, start, end);

/* Sync to GCal */
console.debug("Starting GCal sync...");
const credentials = path.join(ENV_PATH, config.google.credentials);
const scopes = ["https://www.googleapis.com/auth/calendar"];
const calendar = await getGoogleCalendar(credentials, scopes);
for (const period of periods) {
    console.debug("Syncing " + period.nameShort + "...")
    await addPeriodEvent(calendar, config, period);
}

console.log("Done!")