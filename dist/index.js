import { getConfig, getDotenvConfig } from "./config.js";
getDotenvConfig();
const config = await getConfig();
console.log("Logging: " + config.debug.level);
//# sourceMappingURL=index.js.map