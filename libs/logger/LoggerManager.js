"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerManager = void 0;
const Logger_1 = require("./Logger");
const TimeUtils_1 = require("../Utils/TimeUtils");
const fs_extra = require("fs-extra");
/**
 * 用于日志文件的logger
 * 支持控制台与文件独立level限制
 */
class FileLogger extends Logger_1.TypeLogger {
    constructor(classType, fileOutput, fileLevel = Logger_1.Level.DEBUG, consoleLevel = Logger_1.Level.INFO) {
        super(classType, consoleLevel);
        this.fileLevel = fileLevel;
        this.fileOutput = fileOutput;
    }
    log(level, msg) {
        let date = new Date();
        if (level >= this.level) {
            let consoleMsg = this.loggerOutput.format(this.header, TimeUtils_1.TimeUtils.formatDate(date, this.formate), level, msg);
            this.loggerOutput.print(consoleMsg);
        }
        if (level >= this.fileLevel) {
            let fileMsg = this.fileOutput.format(this.header, TimeUtils_1.TimeUtils.formatDate(date, this.formate), level, msg);
            this.fileOutput.print(fileMsg);
        }
    }
    logArgs(level, ...args) {
        let date = new Date();
        if (level >= this.level) {
            let timeStamp = this.loggerOutput.format(this.header, TimeUtils_1.TimeUtils.formatDate(date, this.formate), level, "");
            this.loggerOutput.printArgs(timeStamp, ...args);
        }
        if (level >= this.fileLevel) {
            let timeStamp = this.fileOutput.format(this.header, TimeUtils_1.TimeUtils.formatDate(date, this.formate), level, "");
            this.fileOutput.printArgs(timeStamp, ...args);
        }
    }
}
class FileLoggerManagerOutput extends Logger_1.DefaultOutput {
    constructor(manager) {
        super();
        this.manager = manager;
    }
    print(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = this.manager.getCurrentFilePath();
            if (path != null) {
                // 同步写入目的是为了保证写入文件顺序一致
                yield fs_extra.outputFileSync(path, msg + "\n", { flag: 'a' });
            }
        });
    }
    printArgs(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = this.manager.getCurrentFilePath();
            let each = args[0];
            let getTimeStamp = false;
            for (let i in args) {
                if (!getTimeStamp) {
                    getTimeStamp = true;
                    continue;
                }
                try {
                    let str = JSON.stringify(args[i]);
                    each += str;
                }
                catch (err) {
                    each += (args[i] + "");
                }
            }
            yield fs_extra.outputFileSync(path, each + "\n", { flag: 'a' });
        });
    }
    format(header, timestamp, level, msg) {
        return super.format(header, timestamp, level, msg);
    }
}
class LoggerManager {
    constructor(option) {
        this.option = option;
        let dir = this.option.outPutDir;
        if (dir.lastIndexOf("/") != dir.length && dir.lastIndexOf("\\") != dir.length) {
            this.option.outPutDir += "/";
        }
        this.fileOutput = new FileLoggerManagerOutput(this);
    }
    /**
     * 随时间改变切换日志文件
     */
    getCurrentFilePath() {
        if (this.option.outPutDir == null || this.option.fileTemplate == null) {
            return null;
        }
        return this.option.outPutDir + TimeUtils_1.TimeUtils.formatDate(new Date(), this.option.fileTemplate);
    }
    /**
     * 获取logger
     * @param classType 被写入头部的class
     */
    getLogger(classType) {
        let logger = new FileLogger(classType, this.fileOutput, this.option.fileOutputLevel, this.option.consoleOutputLevel);
        return logger;
    }
}
exports.LoggerManager = LoggerManager;
// let manager = new LoggerManager({
//     fileOutputLevel:Level.DEBUG,
//     consoleOutputLevel:Level.INFO,
//     outPutDir:__dirname,
//     fileTemplate:"$yy-$mon-$dd.log"
// })
// let logger = manager.getLogger(LoggerManager)
// logger.trace("trace")
// logger.debug("debug")
// logger.info("info")
// logger.warn("warn")
// logger.error("error")
// logger.fatal("fatal")
