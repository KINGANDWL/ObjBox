"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const TimeUtils_1 = require("../Utils/TimeUtils");
const Level_1 = require("./Level");
const LoggerOutput_1 = require("./LoggerOutput");
class ConsoleLogger {
    constructor(classType, level = Level_1.Level.INFO, timeFormate = "$yy-$mon-$dd $hh:$min:$ss") {
        this.loggerOutput = new LoggerOutput_1.DefaultOutput();
        this.level = level;
        this.header = classType.name;
        this.timeFormate = timeFormate;
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
    resetTimeFormate(timeFormate) {
        this.timeFormate = timeFormate;
    }
    log(level, msg) {
        if (level >= this.level) {
            msg = this.loggerOutput.format(this.header, TimeUtils_1.TimeUtils.formatDate(new Date(), this.timeFormate), level, msg);
            this.loggerOutput.print(msg);
        }
    }
    trace(msg) {
        this.log(Level_1.Level.TRACE, msg);
    }
    debug(msg) {
        this.log(Level_1.Level.DEBUG, msg);
    }
    info(msg) {
        this.log(Level_1.Level.INFO, msg);
    }
    warn(msg) {
        this.log(Level_1.Level.WARN, msg);
    }
    error(msg) {
        this.log(Level_1.Level.ERROR, msg);
    }
    fatal(msg) {
        this.log(Level_1.Level.FATAL, msg);
    }
    logArgs(level, ...args) {
        if (level >= this.level) {
            let msg = this.loggerOutput.format(this.header, TimeUtils_1.TimeUtils.formatDate(new Date(), this.timeFormate), level, args);
            this.loggerOutput.printArgs(msg, ...args);
        }
    }
    traceArgs(...args) {
        this.logArgs(Level_1.Level.TRACE, ...args);
    }
    debugArgs(...args) {
        this.logArgs(Level_1.Level.DEBUG, ...args);
    }
    infoArgs(...args) {
        this.logArgs(Level_1.Level.INFO, ...args);
    }
    warnArgs(...args) {
        this.logArgs(Level_1.Level.WARN, ...args);
    }
    errorArgs(...args) {
        this.logArgs(Level_1.Level.ERROR, ...args);
    }
    fatalArgs(...args) {
        this.logArgs(Level_1.Level.FATAL, ...args);
    }
}
exports.ConsoleLogger = ConsoleLogger;
