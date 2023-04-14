import { TimeUtils } from '../Utils/TimeUtils';
export type Constructor<T> = new (...args: any[]) => T;


export enum Level {
    ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL, OFF
}

// 日志输出端
export interface LoggerOutput {
    printArgs:(...args)=>void
    print: (msg) => void
    format: (header: string, timestamp: string, level: Level, msg: string) => string
}


// 默认输出
export class DefaultOutput implements LoggerOutput {
    printArgs(...args: any[]){
        console.log(...args);
    }
    print(msg: any) {
        console.log(msg)
    }
    format(header: string, timestamp: string, level: Level, msg: string) {
        let levelMsg=""
        switch(level){
            case Level.ALL:{
                levelMsg="ALL";
            }break;
            case Level.TRACE:{
                levelMsg="TRACE";
            }break;
            case Level.DEBUG:{
                levelMsg="DEBUG";
            }break;
            case Level.INFO:{
                levelMsg="INFO";
            }break;
            case Level.WARN:{
                levelMsg="WARN";
            }break;
            case Level.ERROR:{
                levelMsg="ERROR";
            }break;
            case Level.FATAL:{
                levelMsg="FATAL";
            }break;
            case Level.OFF:{
                levelMsg="OFF";
            }break;
            default:{
                levelMsg="Unknown";
            }
        }
        // 2020-11-12
        return `${timestamp} [${levelMsg.padEnd(5," ")}] ${header}: ${msg}`;
    }
}

export interface Logger{
    log:(level: Level, msg: string)=>void
    trace:(msg: string)=>void
    debug:(msg: string)=>void
    info:(msg: string)=>void
    warn:(msg: string)=>void
    error:(msg: string)=>void
    fatal:(msg: string)=>void
    
    logArgs:(level: Level, ...args:any)=>void
    traceArgs:(...args:any)=>void
    debugArgs:(...args:any)=>void
    infoArgs:(...args:any)=>void
    warnArgs:(...args:any)=>void
    errorArgs:(...args:any)=>void
    fatalArgs:(...args:any)=>void
}

export class TypeLogger implements Logger {
    protected level: Level;
    protected header: string;
    protected formate: string;

    protected loggerOutput: LoggerOutput = null;
    constructor(classType: Constructor<any>, level: Level = Level.INFO) {
        this.level = level
        this.header = classType.name;
        this.formate = "$yy-$mon-$dd $hh:$min:$ss";
        this.loggerOutput = new DefaultOutput()
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
    resetFormate(formate:string){
        this.formate = formate;
    }

    log(level: Level, msg: string) {
        if (level >= this.level) {
            msg = this.loggerOutput.format(this.header, TimeUtils.formatDate(new Date(), this.formate), this.level, msg)
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


    logArgs(level: Level, ...args: any){
        if (level >= this.level) {
            let msg = this.loggerOutput.format(this.header, TimeUtils.formatDate(new Date(), this.formate), this.level, "")
            this.loggerOutput.printArgs(msg,...args)
        }
    }
    traceArgs(...args: any){
        this.logArgs(Level.TRACE,...args);
    }
    debugArgs(...args: any){
        this.logArgs(Level.DEBUG,...args);
    }
    infoArgs(...args: any){
        this.logArgs(Level.INFO,...args);
    }
    warnArgs(...args: any){
        this.logArgs(Level.WARN,...args);
    }
    errorArgs(...args: any){
        this.logArgs(Level.ERROR,...args);
    }
    fatalArgs(...args: any){
        this.logArgs(Level.FATAL,...args);
    }
}