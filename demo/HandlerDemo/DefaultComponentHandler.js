"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DefaultComponentHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultComponentHandler = void 0;
const __1 = require("../..");
let DefaultComponentHandler = DefaultComponentHandler_1 = class DefaultComponentHandler {
    constructor() {
        this.logger = null;
    }
    scanned(objbox, template) {
        if (this.logger == null) {
            this.logger = objbox.getLoggerManager().getLogger(DefaultComponentHandler_1);
        }
        let path = template.filePath;
        path = path.replace(/[\\\/]+/g, "/");
        let index = path.search(/([a-zA-Z0-9_\-. ]+(\\|\/)+){2}[a-zA-Z0-9_\-. ]+.js/);
        if (index >= 0) {
            path = path.slice(index);
        }
        this.logger.info(`scanned: [${template.componentName}] ${path}`);
    }
    beforeCreated(objbox, template) {
        this.logger.info(`beforeCreated: [${template.componentName}]`);
    }
    afterCreated(objbox, template, component) {
        this.logger.info(`afterCreated: [${template.componentName}]`);
    }
    beforeCompleted(objbox, template, component) {
        this.logger.info(`beforeCompleted: [${template.componentName}]`);
    }
    afterCompleted(objbox, template, component) {
        this.logger.info(`afterCompleted: [${template.componentName}]`);
    }
    beforeReady(objbox, template, component) {
        this.logger.info(`beforeReady: [${template.componentName}]`);
    }
    afterReady(objbox, template, component) {
        this.logger.info(`afterReady: [${template.componentName}]`);
    }
};
DefaultComponentHandler = DefaultComponentHandler_1 = __decorate([
    (0, __1.ComponentHandler)()
], DefaultComponentHandler);
exports.DefaultComponentHandler = DefaultComponentHandler;
