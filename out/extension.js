"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const imageEditorProvider_1 = require("./imageEditorProvider");
function activate(context) {
    console.log('Alpha Ichimatsu extension is active');
    context.subscriptions.push(imageEditorProvider_1.ImageEditorProvider.register(context));
}
//# sourceMappingURL=extension.js.map