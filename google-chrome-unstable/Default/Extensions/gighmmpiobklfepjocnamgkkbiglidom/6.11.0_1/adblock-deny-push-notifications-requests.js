/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/premium-push-notification/content/notification.types.ts
const DefaultNotificationPermission = "default";
const DeniedNotificationPermission = "denied";
const GrantedNotificationPermission = "granted";

;// CONCATENATED MODULE: ./src/premium-push-notification/content/deny-notifications-requests.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const denyNotificationsRequests = function () {
    window.Notification.requestPermission = function () {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve) => {
                resolve(window.Notification.permission === DefaultNotificationPermission
                    ? GrantedNotificationPermission
                    : DeniedNotificationPermission);
            });
        });
    };
};
denyNotificationsRequests();

/******/ })()
;
//# sourceMappingURL=adblock-deny-push-notifications-requests.js.map