import { LoggerOutput, Constructor, Logger, Level, TypeLogger, DefaultOutput } from './Logger';
import { TimeUtils } from '../Utils/TimeUtils';
import * as fs_extra from 'fs-extra';

/**
 * 用于日志文件的logger
 * 支持控制台与文件独立level限制
 */
class FileLogger extends TypeLogger {
    protected fileLevel: Level
    protected fileOutput: LoggerOutput

    constructor(classType: Constructor<any>, fileOutput: LoggerOutput, fileLevel: Level = Level.DEBUG, consoleLevel: Level = Level.INFO) {
        super(classType, consoleLevel);
        this.fileLevel = fileLevel
        this.fileOutput = fileOutput
    }

    log(level: Level, msg: string) {
        let date = new Date()
        if (level >= this.level) {
            let consoleMsg = this.loggerOutput.format(this.header, TimeUtils.formatDate(date, this.formate), level, msg);
            this.loggerOutput.print(consoleMsg)
        }
        if (level >= this.fileLevel) {
            let fileMsg = this.fileOutput.format(this.header, TimeUtils.formatDate(date, this.formate), level, msg);
            this.fileOutput.print(fileMsg)
        }
    }

    logArgs(level: Level, ...args: any): void {
        let date = new Date()
        if (level >= this.level) {
            let timeStamp = this.loggerOutput.format(this.header, TimeUtils.formatDate(date, this.formate), level, "");
            this.loggerOutput.printArgs(timeStamp, ...args)
        }
        if (level >= this.fileLevel) {
            let timeStamp = this.fileOutput.format(this.header, TimeUtils.formatDate(date, this.formate), level, "");
            this.fileOutput.printArgs(timeStamp, ...args)
        }
    }
}

class FileLoggerManagerOutput extends DefaultOutput {
    protected manager: LoggerManager
    constructor(manager: LoggerManager) {
        super()
        this.manager = manager
    }

    async print(msg: any) {
        let path = this.manager.getCurrentFilePath()
        if (path != null) {
            // 同步写入目的是为了保证写入文件顺序一致
            await fs_extra.outputFileSync(path, msg + "\n", { flag: 'a' })
        }
    }
    async printArgs(...args: any[]) {
        let path = this.manager.getCurrentFilePath()
        let each = args[0]
        let getTimeStamp = false;
        for (let i in args) {
            if (!getTimeStamp) {
                getTimeStamp = true;
                continue
            }
            try {
                let str = JSON.stringify(args[i])
                each += str
            } catch (err) {
                each += (args[i] + "")
            }
        }
        await fs_extra.outputFileSync(path, each + "\n", { flag: 'a' })
    }
    format(header: string, timestamp: string, level: Level, msg: string): string {
        return super.format(header, timestamp, level, msg)
    }
}

/**
 * 日志管理配置
    格式：
    $yy 年
    $mon 月
    $dd 日
    $hh 时
    $min 分
    $ss 秒
    $ms 毫秒
 */
export type LoggerManagerOption = {
    fileTemplate?: string, // 文件名称模板格式
    outPutDir?: string, // 输出目录
    fileOutputLevel: Level,
    consoleOutputLevel: Level,
}

export class LoggerManager {
    private fileOutput: LoggerOutput;
    private option: LoggerManagerOption
    constructor(option: LoggerManagerOption) {
        this.option = option;
        let dir = this.option.outPutDir
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
        return this.option.outPutDir + TimeUtils.formatDate(new Date(), this.option.fileTemplate);
    }

    /**
     * 获取logger
     * @param classType 被写入头部的class 
     */
    getLogger(classType: Constructor<any>): Logger {
        let logger = new FileLogger(classType, this.fileOutput, this.option.fileOutputLevel, this.option.consoleOutputLevel)
        return logger;
    }
}



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