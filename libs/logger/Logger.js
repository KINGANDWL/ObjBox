"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeLogger = exports.DefaultOutput = exports.Level = void 0;
const TimeUtils_1 = require("../Utils/TimeUtils");
var Level;
(function (Level) {
    Level[Level["ALL"] = 0] = "ALL";
    Level[Level["TRACE"] = 1] = "TRACE";
    Level[Level["DEBUG"] = 2] = "DEBUG";
    Level[Level["INFO"] = 3] = "INFO";
    Level[Level["WARN"] = 4] = "WARN";
    Level[Level["ERROR"] = 5] = "ERROR";
    Level[Level["FATAL"] = 6] = "FATAL";
    Level[Level["OFF"] = 7] = "OFF";
})(Level = exports.Level || (exports.Level = {}));
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
            case Level.ALL:
                {
                    levelMsg = "ALL";
                }
                break;
            case Level.TRACE:
                {
                    levelMsg = "TRACE";
                }
                break;
            case Level.DEBUG:
                {
                    levelMsg = "DEBUG";
                }
                break;
            case Level.INFO:
                {
                    levelMsg = "INFO";
                }
                break;
            case Level.WARN:
                {
                    levelMsg = "WARN";
                }
                break;
            case Level.ERROR:
                {
                    levelMsg = "ERROR";
                }
                break;
            case Level.FATAL:
                {
                    levelMsg = "FATAL";
                }
                break;
            case Level.OFF:
                {
                    levelMsg = "OFF";
                }
                break;
            default: {
                levelMsg = "Unknown";
            }
        }
        // 2020-11-12
        return `${timestamp} [${levelMsg.padEnd(5, " ")}] ${header}: ${msg}`;
    }
}
exports.DefaultOutput = DefaultOutput;
class TypeLogger {
    constructor(classType, level = Level.INFO) {
        this.loggerOutput = null;
        this.level = level;
        this.header = classType.name;
        this.formate = "$yy-$mon-$dd $hh:$min:$ss";
        this.loggerOutput = new DefaultOutput();
    }
    resetHeader(header) {
        this.header = header;
    }
    resetLevel(level) {
        this.level = level;
    }
    resetOutput(output) {
        this.loggerOutput = output;
    }
    resetFormate(formate) {
        this.formate = formate;
    }
    log(level, msg) {
        if (level >= this.level) {
            msg = this.loggerOutput.format(this.header, TimeUtils_1.StringUtils.formatDate(new Date(), this.formate), this.level, msg);
            this.loggerOutput.print(msg);
        }
    }
    trace(msg) {
        this.log(Level.TRACE, msg);
    }
    debug(msg) {
        this.log(Level.DEBUG, msg);
    }
    info(msg) {
        this.log(Level.INFO, msg);
    }
    warn(msg) {
        this.log(Level.WARN, msg);
    }
    error(msg) {
        this.log(Level.ERROR, msg);
    }
    fatal(msg) {
        this.log(Level.FATAL, msg);
    }
    logArgs(level, ...args) {
        if (level >= this.level) {
            let msg = this.loggerOutput.format(this.header, TimeUtils_1.StringUtils.formatDate(new Date(), this.formate), this.level, "");
            this.loggerOutput.printArgs(msg, ...args);
        }
    }
    traceArgs(...args) {
        this.logArgs(Level.TRACE, ...args);
    }
    debugArgs(...args) {
        this.logArgs(Level.DEBUG, ...args);
    }
    infoArgs(...args) {
        this.logArgs(Level.INFO, ...args);
    }
    warnArgs(...args) {
        this.logArgs(Level.WARN, ...args);
    }
    errorArgs(...args) {
        this.logArgs(Level.ERROR, ...args);
    }
    fatalArgs(...args) {
        this.logArgs(Level.FATAL, ...args);
    }
}
exports.TypeLogger = TypeLogger;
