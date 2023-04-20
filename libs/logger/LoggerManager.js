"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerManager = exports.DefaultManagerLogger = void 0;
const Level_1 = require("./Level");
const Logger_1 = require("./Logger");
const LoggerOutput_1 = require("./LoggerOutput");
class DefaultManagerLogger extends Logger_1.ConsoleLogger {
    constructor(classType, level = Level_1.Level.INFO, timeFormate = "$yy-$mon-$dd $hh:$min:$ss", output) {
        super(classType, level, timeFormate);
        this.loggerOutput = output;
    }
}
exports.DefaultManagerLogger = DefaultManagerLogger;
class LoggerManager {
    constructor(loggerManagerConfig, output = new LoggerOutput_1.DefaultOutput()) {
        this.output = output;
        this.loggerManagerConfig = loggerManagerConfig;
    }
    /**
     * 获取logger
     * @param classType 被写入头部的class
     */
    getLogger(classType) {
        let logger = new DefaultManagerLogger(classType, this.loggerManagerConfig.level, this.loggerManagerConfig.timeFormate, this.output);
        return logger;
    }
    setOutput(output) {
        this.output = output;
    }
    getOutput() {
        return this.output;
    }
}
exports.LoggerManager = LoggerManager;
