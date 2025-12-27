"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageEditorProvider = void 0;
const vscode = require("vscode");
class ImageEditorProvider {
    static register(context) {
        const provider = new ImageEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(ImageEditorProvider.viewType, provider);
        return providerRegistration;
    }
    constructor(context) {
        this.context = context;
    }
    async openCustomDocument(uri, openContext, token) {
        return { uri, dispose: () => { } };
    }
    async resolveCustomEditor(document, webviewPanel, _token) {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, 'media'),
                vscode.Uri.joinPath(document.uri, '..')
            ]
        };
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document.uri);
    }
    getHtmlForWebview(webview, imageUri) {
        // Convert local path to Webview URI
        const imageWebviewUri = webview.asWebviewUri(imageUri);
        // CSS for checkerboard pattern
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'imagePreview.css'));
        // Use a strict content security policy
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!-- Data Content Security Policy -->
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob: data:; style-src ${webview.cspSource}; script-src 'none';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet" />
                <title>Image Preview</title>
            </head>
            <body>
                <div class="image-container">
                    <img src="${imageWebviewUri}" />
                </div>
            </body>
            </html>`;
    }
}
exports.ImageEditorProvider = ImageEditorProvider;
ImageEditorProvider.viewType = 'alphaIchimatsu.imageView';
//# sourceMappingURL=imageEditorProvider.js.map