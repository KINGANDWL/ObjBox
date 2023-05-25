import { Level } from "./Level";

// 日志输出端
export interface LoggerOutput {
    printArgs: (...args: any[]) => void
    print: (msg: any) => void
    format: (header: string, timestamp: string, level: Level, msg: string | any[]) => string
}


// 默认输出
export class DefaultOutput implements LoggerOutput {
    printArgs(...args: any[]) {
        console.log(...args);
    }
    print(msg: any) {
        console.log(msg)
    }
    format(header: string, timestamp: string, level: Level, msg: string | any[]) {
        let levelMsg = ""
        switch (level) {
            case Level.ALL: {
                levelMsg = "ALL";
            } break;
            case Level.TRACE: {
                levelMsg = "TRACE";
            } break;
            case Level.DEBUG: {
                levelMsg = "DEBUG";
            } break;
            case Level.INFO: {
                levelMsg = "INFO";
            } break;
            case Level.WARN: {
                levelMsg = "WARN";
            } break;
            case Level.ERROR: {
                levelMsg = "ERROR";
            } break;
            case Level.FATAL: {
                levelMsg = "FATAL";
            } break;
            case Level.OFF: {
                levelMsg = "OFF";
            } break;
            default: {
                levelMsg = "Unknown";
            }
        }
        // 2020-11-12
        return `${timestamp} [${levelMsg.padEnd(5, " ")}] ${header}: ${msg.toString()}`;
    }
}