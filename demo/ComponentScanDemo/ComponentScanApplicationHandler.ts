import { ApplicationHandlerInterface,ApplicationHandler,ScannedTemplate,ScanDir, ObjBoxInterface } from '../../';
import { ComponentScan, ComponentScanArgs } from './ComponentScan.annotation';

@ApplicationHandler()
export class ComponentScanApplicationHandler implements ApplicationHandlerInterface{
    start(objBox: ObjBoxInterface){
        let sTemplates : ScannedTemplate[] = objBox.getAllComponentTemplate();
        for(let sTemplate of sTemplates){
            let a = sTemplate.newInstance.prototype._annotations_.clazz.getAnnotation<ComponentScanArgs>(ComponentScan.name)
            if(a != null){
                objBox.registerFromFiles([new ScanDir(a.annotationArgs.path)])
            }
        }
    }
}