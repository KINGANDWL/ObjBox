import { ComponentHandler, ScannedTemplate, ComponentHandlerInterface, ComponentInterface, ObjBoxInterface } from '../..';
import { Logger } from '../../libs';

@ComponentHandler()
export class DefaultComponentHandler implements ComponentHandlerInterface {
    private logger: Logger = null
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate) {
        if (this.logger == null) {
            this.logger = objbox.getLoggerManager().getLogger(DefaultComponentHandler)
        }

        let path = template.filePath;
        let index = path.search(/([a-zA-Z0-9_\-. ]+(\\|\/)+){2}[a-zA-Z0-9_\-. ]+.js/)
        if (index >= 0) {
            path = path.slice(index)
        }
        this.logger.info(`scanned: [${template.componentName}] ${path}`)

    }
    created(objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface) {
        this.logger.info(`created: [${template.componentName}]`)
    }
    completed(objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface) {
        this.logger.info(`completed: [${template.componentName}]`)
    }
    ready(objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface) {
        this.logger.info(`ready: [${template.componentName}]`)
    }

}