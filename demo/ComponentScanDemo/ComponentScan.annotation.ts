import { getFunName, registerClass } from "../../"

export interface ComponentScanArgs{
    path:string
}

export function ComponentScan(path:string): ClassDecorator {
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        registerClass(_annotationName, { path:path }, target)
    }
}