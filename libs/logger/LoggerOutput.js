"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOutput = void 0;
const Level_1 = require("./Level");
// 默认输出
class DefaultOutput {
    printArgs(...args) {
        console.log(...args);
    }
    print(msg) {
        console.log(msg);
    }
    format(header, timestamp, level, msg) {
        let levelMsg = "";
        switch (level) {
            case Level_1.Level.ALL:
                {
                    levelMsg = "ALL";
                }
                break;
            case Level_1.Level.TRACE:
                {
                    levelMsg = "TRACE";
                }
                break;
            case Level_1.Level.DEBUG:
                {
                    levelMsg = "DEBUG";
                }
                break;
            case Level_1.Level.INFO:
                {
                    levelMsg = "INFO";
                }
                break;
            case Level_1.Level.WARN:
                {
                    levelMsg = "WARN";
                }
                break;
            case Level_1.Level.ERROR:
                {
                    levelMsg = "ERROR";
                }
                break;
            case Level_1.Level.FATAL:
                {
                    levelMsg = "FATAL";
                }
                break;
            case Level_1.Level.OFF:
                {
                    levelMsg = "OFF";
                }
                break;
            default: {
                levelMsg = "Unknown";
            }
        }
        // 2020-11-12
        return `${timestamp} [${levelMsg.padEnd(5, " ")}] ${header}: ${msg.toString()}`;
    }
}
exports.DefaultOutput = DefaultOutput;
