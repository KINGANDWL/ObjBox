import { Level } from './Level';
import { Constructor, Logger, ConsoleLogger } from './Logger';
import { LoggerManagerConfig } from './LoggerManagerConfig';
import { DefaultOutput, LoggerOutput } from './LoggerOutput';



export class DefaultManagerLogger extends ConsoleLogger {
    constructor(classType: Constructor<any>, level: Level = Level.INFO, timeFormate: string = "$yy-$mon-$dd $hh:$min:$ss", output: LoggerOutput) {
        super(classType, level, timeFormate)
        this.loggerOutput = output
    }
}


export class LoggerManager {
    private output: LoggerOutput;
    private loggerManagerConfig: LoggerManagerConfig
    constructor(loggerManagerConfig: LoggerManagerConfig, output: LoggerOutput = new DefaultOutput()) {
        this.output = output;
        this.loggerManagerConfig = loggerManagerConfig;
    }

    /**
     * 获取logger
     * @param classType 被写入头部的class 
     */
    getLogger(classType: Constructor<any>): Logger {
        let logger = new DefaultManagerLogger(classType, this.loggerManagerConfig.level, this.loggerManagerConfig.timeFormate, this.output)
        return logger;
    }

    setOutput(output: LoggerOutput) {
        this.output = output
    }

    getOutput(): LoggerOutput {
        return this.output
    }
}

