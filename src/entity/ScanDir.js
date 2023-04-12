"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanDir = void 0;
/**
 * 扫描目录
 */
class ScanDir {
    constructor(dirPath, excludeRegExp = []) {
        this.dirPath = dirPath;
        this.excludeRegExp = excludeRegExp;
    }
    isExclude(fileName) {
        for (let i in this.excludeRegExp) {
            if (fileName.search(this.excludeRegExp[i]) >= 0) {
                return true;
            }
        }
        return false;
    }
}
exports.ScanDir = ScanDir;
