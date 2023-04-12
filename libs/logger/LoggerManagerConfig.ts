import { Level } from "./Logger"
export interface LoggerManagerConfig {
    fileOutputLevel: Level
    consoleOutputLevel: Level
    outPutDir: string
    fileTemplate: string
}


// let config: LoggerManagerConfig = {
//     fileOutputLevel: Level.OFF,
//     consoleOutputLevel: Level.ALL,
//     outPutDir: __dirname + "/logs",
//     fileTemplate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day}.log`
// }