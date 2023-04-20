import { TimeUtils } from '../Utils/TimeUtils';
import { Level } from './Level';
import { DefaultOutput, LoggerOutput } from './LoggerOutput';


export type Constructor<T> = new (...args: any[]) => T;


export interface Logger {
    log: (level: Level, msg: string) => void
    trace: (msg: string) => void
    debug: (msg: string) => void
    info: (msg: string) => void
    warn: (msg: string) => void
    error: (msg: string) => void
    fatal: (msg: string) => void

    logArgs: (level: Level, ...args: any) => void
    traceArgs: (...args: any) => void
    debugArgs: (...args: any) => void
    infoArgs: (...args: any) => void
    warnArgs: (...args: any) => void
    errorArgs: (...args: any) => void
    fatalArgs: (...args: any) => void
}

export class ConsoleLogger implements Logger {
    protected level: Level;
    protected header: string;
    protected timeFormate: string;

    protected loggerOutput: LoggerOutput = new DefaultOutput();

    constructor(classType: Constructor<any>, level: Level = Level.INFO, timeFormate: string = "$yy-$mon-$dd $hh:$min:$ss") {
        this.level = level
        this.header = classType.name;
        this.timeFormate = timeFormate;
    }

    resetHeader(header: string) {
        this.header = header;
    }
    resetLevel(level: Level) {
        this.level = level;
    }
    resetOutput(output: LoggerOutput) {
        this.loggerOutput = output;
    }
    resetTimeFormate(timeFormate: string) {
        this.timeFormate = timeFormate;
    }

    log(level: Level, msg: string) {
        if (level >= this.level) {
            msg = this.loggerOutput.format(this.header, TimeUtils.formatDate(new Date(), this.timeFormate), level, msg)
            this.loggerOutput.print(msg)
        }
    }
    trace(msg: string) {
        this.log(Level.TRACE, msg)
    }
    debug(msg: string) {
        this.log(Level.DEBUG, msg)
    }
    info(msg: string) {
        this.log(Level.INFO, msg)
    }
    warn(msg: string) {
        this.log(Level.WARN, msg)
    }
    error(msg: string) {
        this.log(Level.ERROR, msg)
    }
    fatal(msg: string) {
        this.log(Level.FATAL, msg)
    }


    logArgs(level: Level, ...args: any) {
        if (level >= this.level) {
            let msg = this.loggerOutput.format(this.header, TimeUtils.formatDate(new Date(), this.timeFormate), this.level, args)
            this.loggerOutput.printArgs(msg, ...args)
        }
    }
    traceArgs(...args: any) {
        this.logArgs(Level.TRACE, ...args);
    }
    debugArgs(...args: any) {
        this.logArgs(Level.DEBUG, ...args);
    }
    infoArgs(...args: any) {
        this.logArgs(Level.INFO, ...args);
    }
    warnArgs(...args: any) {
        this.logArgs(Level.WARN, ...args);
    }
    errorArgs(...args: any) {
        this.logArgs(Level.ERROR, ...args);
    }
    fatalArgs(...args: any) {
        this.logArgs(Level.FATAL, ...args);
    }
}
