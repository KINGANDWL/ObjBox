"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DefaultApplicationHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultApplicationHandler = void 0;
const __1 = require("../..");
let DefaultApplicationHandler = DefaultApplicationHandler_1 = class DefaultApplicationHandler {
    constructor() {
        this.logger = null;
    }
    start(objbox) {
        if (this.logger == null) {
            this.logger = objbox.getLoggerManager().getLogger(DefaultApplicationHandler_1);
            objbox.printLogo();
        }
        this.logger.info("start");
    }
    preprocessScannedTemplate(objbox, templates) {
        this.logger.info("preprocessScannedTemplate");
    }
    beforePrepare(objBox) {
        this.logger.info("beforePrepare");
    }
    afterPrepare(objBox) {
        this.logger.info("afterPrepare");
    }
    beforeRunning(objbox) {
        this.logger.info("beforeRunning");
    }
    afterRunning(objbox) {
        this.logger.info("afterRunning");
    }
};
DefaultApplicationHandler = DefaultApplicationHandler_1 = __decorate([
    (0, __1.ApplicationHandler)()
], DefaultApplicationHandler);
exports.DefaultApplicationHandler = DefaultApplicationHandler;
