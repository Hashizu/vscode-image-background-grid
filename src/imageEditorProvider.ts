import * as vscode from 'vscode';

export class ImageEditorProvider implements vscode.CustomReadonlyEditorProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new ImageEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(ImageEditorProvider.viewType, provider);
        return providerRegistration;
    }

    public static readonly viewType = 'alphaIchimatsu.imageView';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    public async openCustomDocument(
        uri: vscode.Uri,
        openContext: vscode.CustomDocumentOpenContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        return { uri, dispose: () => { } };
    }

    public async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {

        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, 'media'),
                vscode.Uri.joinPath(document.uri, '..')
            ]
        };

        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document.uri);
    }

    private getHtmlForWebview(webview: vscode.Webview, imageUri: vscode.Uri): string {
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
