import { ApplicationHandler, ApplicationHandlerInterface, ScannedTemplate, ObjBoxInterface } from '../..';
import { Logger } from '../../libs';

@ApplicationHandler()
export class DefaultApplicationHandler implements ApplicationHandlerInterface {
    private logger: Logger = null
    async start(objbox: ObjBoxInterface) {
        if (this.logger == null) {
            this.logger = objbox.getLoggerManager().getLogger(DefaultApplicationHandler)
            objbox.printLogo()
        }
        this.logger.info("start")
    }
    preprocessScannedTemplate(objbox: ObjBoxInterface, templates: ScannedTemplate[]) {
        this.logger.info("preprocessScannedTemplate")
    }
    beforePrepare(objBox: ObjBoxInterface) {
        this.logger.info("beforePrepare")
    }
    afterPrepare(objBox: ObjBoxInterface) {
        this.logger.info("afterPrepare")
    }
    beforeRunning(objbox: ObjBoxInterface) {
        this.logger.info("beforeRunning")
    }
    afterRunning(objbox: ObjBoxInterface) {
        this.logger.info("afterRunning")
    }
}