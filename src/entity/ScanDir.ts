/**
 * 扫描目录
 */
export class ScanDir {
    dirPath: string
    excludeRegExp: RegExp[]
    constructor(dirPath: string, excludeRegExp: RegExp[] = []) {
        this.dirPath = dirPath
        this.excludeRegExp = excludeRegExp
    }
    isExclude(fileName: string) {
        for (let i in this.excludeRegExp) {
            if (fileName.search(this.excludeRegExp[i]) >= 0) {
                return true
            }
        }
        return false
    }
}