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
        path = path.replace(/[\\\/]+/g,"/")
        let index = path.search(/([a-zA-Z0-9_\-. ]+(\\|\/)+){2}[a-zA-Z0-9_\-. ]+.js/)
        if (index >= 0) {
            path = path.slice(index)
        }
        this.logger.info(`scanned: [${template.componentName}] ${path}`)

    }
    beforeCreated(objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface) {
        this.logger.info(`beforeCreated: [${template.componentName}]`)
    }
    afterCreated(objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface) {
        this.logger.info(`afterCreated: [${template.componentName}]`)
    }
    beforeCompleted(objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface) {
        this.logger.info(`beforeCompleted: [${template.componentName}]`)
    }
    afterCompleted(objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface) {
        this.logger.info(`afterCompleted: [${template.componentName}]`)
    }
    beforeReady(objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface) {
        this.logger.info(`beforeReady: [${template.componentName}]`)
    }
    afterReady(objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface) {
        this.logger.info(`afterReady: [${template.componentName}]`)
    }

}