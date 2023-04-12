"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = exports.TimeFlag = void 0;
var TimeFlag;
(function (TimeFlag) {
    TimeFlag["Year"] = "$yy";
    TimeFlag["Month"] = "$mon";
    TimeFlag["Day"] = "$dd";
    TimeFlag["Hour"] = "$hh";
    TimeFlag["Minute"] = "$min";
    TimeFlag["Second"] = "$ss";
    TimeFlag["Millisecond"] = "$ms";
})(TimeFlag = exports.TimeFlag || (exports.TimeFlag = {}));
// 时间格式化
class StringUtils {
    static formatDate(data, format) {
        let year = data.getFullYear() + "";
        let month = ((data.getMonth() + 1) + "").padStart(2, "0");
        let day = (data.getDate() + "").padStart(2, "0");
        let hour = (data.getHours() + "").padStart(2, "0");
        let minute = (data.getMinutes() + "").padStart(2, "0");
        let seconds = (data.getSeconds() + "").padStart(2, "0");
        let milliseconds = (data.getMilliseconds() + "").padStart(3, "0");
        format = format
            .replace(/\$yy/g, year)
            .replace(/\$mon/g, month)
            .replace(/\$dd/g, day)
            .replace(/\$hh/g, hour)
            .replace(/\$min/g, minute)
            .replace(/\$ss/g, seconds)
            .replace(/\$ms/g, milliseconds);
        return format;
    }
}
exports.StringUtils = StringUtils;
// console.log(StringUtils.formatDate(new Date(),`$yy-$mm-$dd $hh:$mm:$ss:$ms`))
