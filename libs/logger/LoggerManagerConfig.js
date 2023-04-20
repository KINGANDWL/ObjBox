"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultManagerConfig = void 0;
const TimeUtils_1 = require("../Utils/TimeUtils");
const Level_1 = require("./Level");
exports.DefaultManagerConfig = {
    level: Level_1.Level.ALL,
    timeFormate: `${TimeUtils_1.TimeFlag.Year}-${TimeUtils_1.TimeFlag.Month}-${TimeUtils_1.TimeFlag.Day} ${TimeUtils_1.TimeFlag.Hour}:${TimeUtils_1.TimeFlag.Minute}:${TimeUtils_1.TimeFlag.Second}`
};
