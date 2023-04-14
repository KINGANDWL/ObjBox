export enum TimeFlag{
    Year="$yy",Month="$mon",Day="$dd",Hour="$hh",Minute="$min",Second="$ss",Millisecond="$ms"
}

// 时间格式化
export class TimeUtils {
    static formatDate(data: Date, format: string) {
        let year = data.getFullYear()+"";
        let month = ((data.getMonth() + 1)+"").padStart(2,"0");
        let day = (data.getDate()+"").padStart(2,"0");
        let hour = (data.getHours()+"").padStart(2,"0");
        let minute = (data.getMinutes()+"").padStart(2,"0");
        let seconds = (data.getSeconds()+"").padStart(2,"0");
        let milliseconds = (data.getMilliseconds()+"").padStart(3,"0");
        
        format = format
                    .replace(/\$yy/g,year)
                    .replace(/\$mon/g,month)
                    .replace(/\$dd/g,day)
                    .replace(/\$hh/g,hour)
                    .replace(/\$min/g,minute)
                    .replace(/\$ss/g,seconds)
                    .replace(/\$ms/g,milliseconds)
        
        return format;
    }
    
    static getTimeObject(data: Date):{
        year: string,month: string,day: string,
        hour: string,minute: string,seconds: string,milliseconds: string
    }{
        let year = data.getFullYear()+"";
        let month = ((data.getMonth() + 1)+"").padStart(2,"0");
        let day = (data.getDate()+"").padStart(2,"0");
        let hour = (data.getHours()+"").padStart(2,"0");
        let minute = (data.getMinutes()+"").padStart(2,"0");
        let seconds = (data.getSeconds()+"").padStart(2,"0");
        let milliseconds = (data.getMilliseconds()+"").padStart(3,"0");

        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            seconds: seconds,
            milliseconds: milliseconds,  
        }
    }
}

// console.log(StringUtils.formatDate(new Date(),`$yy-$mm-$dd $hh:$mm:$ss:$ms`))