import { readFile } from "fs/promises";
import * as path from "path"
import * as dotenv from "dotenv"
import { WebUntisAnonymousAuth } from "webuntis";

export const ENV_PATH = path.join(process.cwd(), "env")

export const getPathToConfig = (defaultPath = "config.json") => 
    path.join(ENV_PATH, process.env.CONFIGURATION || defaultPath);

export const getPathToEnvironment = () => path.join(ENV_PATH, ".env");

export const getDotenvConfig = (): dotenv.DotenvConfigOutput => dotenv.config({
    path: getPathToEnvironment()
})

export const getConfig = async (defaultPath?: string): Promise<Config> => {
    const path = getPathToConfig(defaultPath);
    const data = await readFile(path, "utf-8");
    return JSON.parse(data) as Config;
}

export type Config = {
    untis: {
        year: string,
        course: string,
        school: string,
        base: string,
    }
}