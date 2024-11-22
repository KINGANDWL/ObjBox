import { TimeFlag } from "../Utils/TimeUtils";
import { Level } from "./Level"

export interface LoggerManagerConfig {
    level: Level;
    timeFormate: string;
}

export let DefaultManagerConfig:LoggerManagerConfig = {
    level : Level.ALL,
    timeFormate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day} ${TimeFlag.Hour}:${TimeFlag.Minute}:${TimeFlag.Second}`
}